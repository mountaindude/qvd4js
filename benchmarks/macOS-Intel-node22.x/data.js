window.BENCHMARK_DATA = {
  "lastUpdate": 1761139311559,
  "repoUrl": "https://github.com/ptarmiganlabs/qvd4js",
  "entries": {
    "qvd4js Benchmark - macOS-Intel - Node 22.x": [
      {
        "commit": {
          "author": {
            "email": "goran@ptarmiganlabs.com",
            "name": "Göran Sander",
            "username": "mountaindude"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9ba6f3363fbc34c9ad5eb6d631c6d38bbca8a740",
          "message": "Merge pull request #47 from ptarmiganlabs/copilot/replace-flaky-timing-tests",
          "timestamp": "2025-10-22T14:36:06+02:00",
          "tree_id": "759d06c652543d86239b18d8cc93431cd93ee6d0",
          "url": "https://github.com/ptarmiganlabs/qvd4js/commit/9ba6f3363fbc34c9ad5eb6d631c6d38bbca8a740"
        },
        "date": 1761137621760,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 131.28438785837264,
            "range": "±2.47%",
            "unit": "ops/sec",
            "extra": "130 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 3.0962018638587563,
            "range": "±3.59%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 1.1707926772824642,
            "range": "±1.27%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 29.57223137142592,
            "range": "±6.48%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 23.212071100594432,
            "range": "±5.95%",
            "unit": "ops/sec",
            "extra": "64 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "goran@ptarmiganlabs.com",
            "name": "Göran Sander",
            "username": "mountaindude"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f831a064a89a2408d8e0cd9572b4a4d73535e24a",
          "message": "Merge pull request #48 from ptarmiganlabs/copilot/replace-flaky-timing-tests",
          "timestamp": "2025-10-22T15:07:13+02:00",
          "tree_id": "8cf6ccdaf7341fc0e497bfef9dbce867add34710",
          "url": "https://github.com/ptarmiganlabs/qvd4js/commit/f831a064a89a2408d8e0cd9572b4a4d73535e24a"
        },
        "date": 1761139310512,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 126.71339383851347,
            "range": "±2.27%",
            "unit": "ops/sec",
            "extra": "126 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 3.1022188388197245,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 1.1828065958479306,
            "range": "±0.62%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 29.265364968567777,
            "range": "±5.98%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 22.91563762326884,
            "range": "±5.06%",
            "unit": "ops/sec",
            "extra": "64 samples"
          }
        ]
      }
    ]
  }
}