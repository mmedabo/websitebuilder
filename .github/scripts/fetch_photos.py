"""Temporary helper: fetch II's home-page banner and night-photo candidates.

Runs in GitHub Actions because the authoring environment cannot reach image
hosts. Writes reference/ii-th/images/ and reference/photo-candidates/.
Only keeps freely licensed, landscape photos at least ~4K wide.
"""
import html
import json
import os
import re
import urllib.parse
import urllib.request

UA = 'ii-concept-asset-fetch/1.0 (https://github.com/mmedabo/websitebuilder)'
CAND_DIR = 'reference/photo-candidates/pass2'
MIN_WIDTH = 3800
MAX_CANDIDATES = 30
FREE_LICENSE = re.compile(r'^(cc0|cc[- ]by(-sa)?([- ][0-9.]+)?|public domain|pd\b)', re.I)


def get(url, binary=False):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': '*/*'})
    with urllib.request.urlopen(req, timeout=90) as r:
        data = r.read()
    return data if binary else data.decode('utf-8')


def save(url, path):
    data = get(url, binary=True)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'wb') as f:
        f.write(data)
    return len(data)


def plain(value):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', value or ''))).strip()


out = {'banner': None, 'candidates': [], 'errors': []}

# 1. II's current home-page banner was fetched in pass 1
#    (reference/ii-th/images/home-banner.jpg). Skip pass-1 candidates.
with open('reference/photo-candidates/manifest.json', encoding='utf-8') as f:
    seen = {c['title'] for c in json.load(f)['candidates']}
cands = []

# 2. Wikimedia Commons: free licences only. Pass 2 targets II's banner scene:
# the Chao Phraya river curving through the skyline at night.
SEARCHES = ['Chao Phraya River night skyline', 'Chao Phraya River Bangkok night panorama', 'Bangkok river night',
            'Chao Phraya night aerial', 'Bangkok skyline river dusk', 'Taksin bridge night', 'Sathorn river night']
CATEGORIES = ['Chao Phraya River at night', 'Night views of Bangkok', 'Skylines of Bangkok at night',
              'Panoramics of Bangkok', 'Chao Phraya River in Bangkok', 'Skylines of Bangkok']
queries = [('search', q) for q in SEARCHES] + [('category', c) for c in CATEGORIES]
for kind, q in queries:
    params = {'action': 'query', 'format': 'json', 'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata|mime', 'iiurlwidth': 800}
    if kind == 'search':
        params.update({'generator': 'search', 'gsrsearch': q, 'gsrnamespace': 6, 'gsrlimit': 50})
    else:
        params.update({'generator': 'categorymembers', 'gcmtitle': 'Category:' + q, 'gcmtype': 'file', 'gcmlimit': 100})
    try:
        data = json.loads(get('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)))
    except Exception as e:
        out['errors'].append(f'commons {q}: {e}')
        continue
    for page in data.get('query', {}).get('pages', {}).values():
        info = (page.get('imageinfo') or [{}])[0]
        w, h = info.get('width', 0), info.get('height', 0)
        meta = info.get('extmetadata', {})
        lic = plain(meta.get('LicenseShortName', {}).get('value'))
        if page['title'] in seen or info.get('mime') != 'image/jpeg' or w < MIN_WIDTH or w <= h:
            continue
        if not FREE_LICENSE.match(lic):
            continue
        seen.add(page['title'])
        cands.append({
            'source': 'Wikimedia Commons', 'query': q, 'title': page['title'], 'width': w, 'height': h,
            'license': lic, 'license_url': plain(meta.get('LicenseUrl', {}).get('value')),
            'author': plain(meta.get('Artist', {}).get('value'))[:120],
            'description': plain(meta.get('ImageDescription', {}).get('value'))[:240],
            'page_url': info.get('descriptionurl'), 'full_url': info.get('url'), 'preview_url': info.get('thumburl'),
        })

# 3. Unsplash: every non-Plus photo is under the Unsplash License.
def unsplash_photo(p, q):
    if p.get('premium') or p.get('plus') or p['id'] in seen:
        return
    w, h = p.get('width', 0), p.get('height', 0)
    if w < MIN_WIDTH or w <= h:
        return
    seen.add(p['id'])
    raw = p['urls']['raw']
    cands.append({
        'source': 'Unsplash', 'query': q, 'title': p['id'], 'width': w, 'height': h,
        'license': 'Unsplash License', 'license_url': 'https://unsplash.com/license',
        'author': (p.get('user') or {}).get('name', ''),
        'description': (p.get('description') or p.get('alt_description') or '')[:240],
        'page_url': p['links']['html'], 'full_url': raw,
        'preview_url': raw + ('&' if '?' in raw else '?') + 'w=800&q=70&fm=jpg',
    })

try:
    unsplash_photo(json.loads(get('https://unsplash.com/napi/photos/g8FVrGbpUrI')), 'direct: ICONSIAM night')
except Exception as e:
    out['errors'].append(f'unsplash direct: {e}')
for q in ['bangkok night skyline', 'bangkok night', 'bangkok cityscape night', 'bangkok skyline', 'chao phraya night']:
    try:
        data = json.loads(get('https://unsplash.com/napi/search/photos?' + urllib.parse.urlencode({'query': q, 'per_page': 30})))
    except Exception as e:
        out['errors'].append(f'unsplash {q}: {e}')
        continue
    for p in data.get('results', []):
        unsplash_photo(p, q)

# Prefer river + night photos, then night, then the widest.
night = re.compile(r'night|dusk|twilight|blue hour|evening|lights|ราตรี|กลางคืน', re.I)
river = re.compile(r'chao ?phraya|river|แม่น้ำ', re.I)
def rank(c):
    text = c['title'] + ' ' + c['description'] + ' ' + c['query']
    return (not (night.search(text) and river.search(text)), not night.search(text), -c['width'])
cands.sort(key=rank)
cands = cands[:MAX_CANDIDATES]

os.makedirs(CAND_DIR, exist_ok=True)
for i, c in enumerate(cands, 1):
    c['preview'] = f'{CAND_DIR}/{i:02d}.jpg'
    try:
        save(c['preview_url'], c['preview'])
    except Exception as e:
        c['preview'] = None
        out['errors'].append(f'preview {c["title"]}: {e}')
out['candidates'] = cands

with open(f'{CAND_DIR}/manifest.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, indent=2, ensure_ascii=False)
print(json.dumps({'banner': out['banner'], 'candidates': len(cands), 'errors': out['errors']}, indent=2))
