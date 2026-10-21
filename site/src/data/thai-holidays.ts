// Thai holidays for working-day counts (BOI bookings need 3 working days).
// Source: Bank of Thailand, financial institutions' holidays, as published:
//   2026: Notification No. 31/2568; Bangkok extra day: No. 26/2569
//   2027: Notification No. 37/2569 (announced 17 August 2026)
// Copies: reference/holidays/. Regional days (southern provinces, Islamic
// Bank) are left out: they do not apply to II's Bangkok office.
// Add the next year when the Bank of Thailand publishes it (usually August).
export const THAI_HOLIDAYS: Record<string, string> = {
  '2026-01-01': 'New Year’s Day',
  '2026-01-02': 'Additional special holiday',
  '2026-03-03': 'Makha Bucha Day',
  '2026-04-06': 'Chakri Memorial Day',
  '2026-04-13': 'Songkran Festival',
  '2026-04-14': 'Songkran Festival',
  '2026-04-15': 'Songkran Festival',
  '2026-05-01': 'National Labor Day',
  '2026-05-04': 'Coronation Day',
  '2026-06-01': 'Substitution for Visakha Bucha Day',
  '2026-06-03': 'H.M. Queen Suthida’s Birthday',
  '2026-07-28': 'H.M. King Maha Vajiralongkorn’s Birthday',
  '2026-07-29': 'Asarnha Bucha Day',
  '2026-08-12': 'H.M. Queen Sirikit the Queen Mother’s Birthday and Mother’s Day',
  '2026-10-13': 'H.M. King Bhumibol Adulyadej the Great Memorial Day',
  '2026-10-16': 'Additional special holiday in Bangkok',
  '2026-10-23': 'H.M. King Chulalongkorn the Great Memorial Day',
  '2026-12-07': 'Substitution for National Day and Father’s Day',
  '2026-12-10': 'Constitution Day',
  '2026-12-31': 'New Year’s Eve',
  '2027-01-01': 'New Year’s Day',
  '2027-02-22': 'Substitution for Makha Bucha Day',
  '2027-04-06': 'Chakri Memorial Day',
  '2027-04-13': 'Songkran Festival',
  '2027-04-14': 'Songkran Festival',
  '2027-04-15': 'Songkran Festival',
  '2027-05-03': 'Substitution for National Labor Day',
  '2027-05-04': 'Coronation Day',
  '2027-05-20': 'Visakha Bucha Day',
  '2027-06-03': 'H.M. Queen Suthida’s Birthday',
  '2027-07-19': 'Substitution for Asarnha Bucha Day',
  '2027-07-28': 'H.M. King Maha Vajiralongkorn’s Birthday',
  '2027-08-12': 'H.M. Queen Sirikit the Queen Mother’s Birthday and Mother’s Day',
  '2027-10-13': 'H.M. King Bhumibol Adulyadej the Great Memorial Day',
  '2027-10-25': 'Substitution for H.M. King Chulalongkorn the Great Memorial Day',
  '2027-12-06': 'Substitution for National Day and Father’s Day',
  '2027-12-10': 'Constitution Day',
  '2027-12-31': 'New Year’s Eve',
}

// Holidays are known up to and including this date.
export const HOLIDAYS_KNOWN_UNTIL = '2027-12-31'
