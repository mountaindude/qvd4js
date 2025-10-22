window.BENCHMARK_DATA = {
  "lastUpdate": 1761128102718,
  "repoUrl": "https://github.com/ptarmiganlabs/qvd4js",
  "entries": {
    "qvd4js Benchmark - macOS-ARM - Node 22.x": [
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
        "date": 1761128101904,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 451.7794337750058,
            "range": "±0.56%",
            "unit": "ops/sec",
            "extra": "451 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 10.841748733231897,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 3.9074449091361823,
            "range": "±0.47%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 99.78597137295165,
            "range": "±3.85%",
            "unit": "ops/sec",
            "extra": "98 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 79.22741392498044,
            "range": "±2.39%",
            "unit": "ops/sec",
            "extra": "79 samples"
          }
        ]
      }
    ]
  }
}