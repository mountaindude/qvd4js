window.BENCHMARK_DATA = {
  "lastUpdate": 1761127979224,
  "repoUrl": "https://github.com/ptarmiganlabs/qvd4js",
  "entries": {
    "qvd4js Benchmark - Linux - Node 22.x": [
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
        "date": 1761127978334,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 173.46752317427402,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "171 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 4.358009997441036,
            "range": "±0.87%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 1.590415704256251,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 43.95822528824915,
            "range": "±6.54%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 32.803638406733754,
            "range": "±5.04%",
            "unit": "ops/sec",
            "extra": "64 samples"
          }
        ]
      }
    ]
  }
}