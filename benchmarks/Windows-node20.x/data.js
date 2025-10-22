window.BENCHMARK_DATA = {
  "lastUpdate": 1761128179562,
  "repoUrl": "https://github.com/ptarmiganlabs/qvd4js",
  "entries": {
    "qvd4js Benchmark - Windows - Node 20.x": [
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
          "id": "7b4233f5ceb79312d51fbed1f2a6e5977d94484a",
          "message": "Merge pull request #39 from ptarmiganlabs/copilot/replace-flaky-timing-tests",
          "timestamp": "2025-10-22T12:10:21+02:00",
          "tree_id": "4af1a15d4cade6ac487410e623e4cc2e052ef77f",
          "url": "https://github.com/ptarmiganlabs/qvd4js/commit/7b4233f5ceb79312d51fbed1f2a6e5977d94484a"
        },
        "date": 1761128175691,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 47.46398974035911,
            "range": "±5.17%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 1.8709090775730672,
            "range": "±4.61%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 0.639451514427913,
            "range": "±3.10%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 16.09340342352824,
            "range": "±8.05%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 13.168602401719387,
            "range": "±7.34%",
            "unit": "ops/sec",
            "extra": "64 samples"
          }
        ]
      }
    ]
  }
}