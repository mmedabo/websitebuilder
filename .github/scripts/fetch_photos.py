"""Temporary helper (pass 3): download the chosen hero photo at full resolution.

Runs in GitHub Actions because the authoring environment cannot reach image
hosts. Chosen from the pass-2 candidates:
"Chao Phraya et Bang Rak vus de l'Iconsiam.jpg", Wikimedia Commons, CC0.
"""
import os
import urllib.request

UA = 'ii-concept-asset-fetch/1.0 (https://github.com/mmedabo/websitebuilder)'
URL = 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Chao_Phraya_et_Bang_Rak_vus_de_l%27Iconsiam.jpg'
OUT = 'reference/photo-candidates/selected/chao-phraya-night-original.jpg'

req = urllib.request.Request(URL, headers={'User-Agent': UA})
with urllib.request.urlopen(req, timeout=120) as r:
    data = r.read()
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, 'wb') as f:
    f.write(data)
print(f'saved {OUT}: {len(data)} bytes')
