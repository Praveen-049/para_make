import urllib.request
import urllib.error
urls = [
    'https://fuzzy-coins-wonder.loca.lt/api/health',
    'http://localhost:8000/api/health',
]
for u in urls:
    try:
        with urllib.request.urlopen(u, timeout=10) as r:
            print(u, r.status, r.reason, r.read().decode())
    except urllib.error.HTTPError as e:
        print(u, 'HTTPError', e.code, e.reason, e.read().decode('utf-8', errors='ignore'))
    except Exception as e:
        print(u, 'ERROR', type(e).__name__, e)
