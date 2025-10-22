window.BENCHMARK_DATA = {
  "lastUpdate": 1761128639934,
  "repoUrl": "https://github.com/ptarmiganlabs/qvd4js",
  "entries": {
    "qvd4js Benchmark - macOS-ARM - Node 24.x": [
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
        "date": 1761128015616,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 611.0901377525705,
            "range": "±0.16%",
            "unit": "ops/sec",
            "extra": "611 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 14.776148929973495,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 5.926001179459316,
            "range": "±0.69%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 142.64532637537832,
            "range": "±0.67%",
            "unit": "ops/sec",
            "extra": "143 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 121.28298245860678,
            "range": "±0.27%",
            "unit": "ops/sec",
            "extra": "122 samples"
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
        "date": 1761128638724,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 616.9700729311085,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "617 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 14.650025435216987,
            "range": "±1.26%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 5.9237935653217,
            "range": "±0.64%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 148.18063163574735,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "148 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 127.1326681153233,
            "range": "±0.54%",
            "unit": "ops/sec",
            "extra": "128 samples"
          }
        ]
      }
    ]
  }
}