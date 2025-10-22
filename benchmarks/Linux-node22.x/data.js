window.BENCHMARK_DATA = {
  "lastUpdate": 1761128594064,
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
          "id": "84b76da7382d387ad1ac9e5ddf55de2476064ea7",
          "message": "Merge pull request #40 from ptarmiganlabs/copilot/replace-flaky-timing-tests",
          "timestamp": "2025-10-22T12:20:32+02:00",
          "tree_id": "b4bfe3952f5d8022f4bbcb8bf77b125ecfd59ec1",
          "url": "https://github.com/ptarmiganlabs/qvd4js/commit/84b76da7382d387ad1ac9e5ddf55de2476064ea7"
        },
        "date": 1761128593655,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 173.12796055222228,
            "range": "±0.68%",
            "unit": "ops/sec",
            "extra": "173 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 4.219466901086122,
            "range": "±0.80%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 1.5515534289113957,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 42.70199851252961,
            "range": "±6.62%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 32.35401559590781,
            "range": "±5.22%",
            "unit": "ops/sec",
            "extra": "64 samples"
          }
        ]
      }
    ]
  }
}