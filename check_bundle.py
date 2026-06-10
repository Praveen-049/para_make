import urllib.request, re
html = urllib.request.urlopen('https://para-make.vercel.app', timeout=20).read().decode('utf-8', errors='ignore')
match = re.search(r'src="(/assets/[^"]+)"', html)
if not match:
    print('No bundle path found')
    raise SystemExit(1)
path = match.group(1)
print('bundle path', path)
js = urllib.request.urlopen('https://para-make.vercel.app' + path, timeout=20).read().decode('utf-8', errors='ignore')
for term in ['localhost:8000', 'fuzzy-coins-wonder.loca.lt', 'VITE_API_URL', 'api/health']:
    print(term, 'found:', term in js)
idx = js.find('localhost:8000')
if idx == -1:
    idx = js.find('fuzzy-coins-wonder.loca.lt')
if idx == -1:
    idx = js.find('VITE_API_URL')
print('idx', idx)
print(js[max(0,idx-100):idx+300])
