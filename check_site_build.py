import urllib.request
import re
url = 'https://para-make.vercel.app'
print('Fetching', url)
text = urllib.request.urlopen(url, timeout=20).read().decode('utf-8', errors='ignore')
print('Length:', len(text))
for term in ['localhost:8000', 'fuzzy-coins-wonder.loca.lt', 'VITE_API_URL', 'para-make.vercel.app']:
    print(term, 'found:', bool(re.search(re.escape(term), text)))
print(text[:2000])
