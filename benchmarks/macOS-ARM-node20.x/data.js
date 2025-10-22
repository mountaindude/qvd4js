window.BENCHMARK_DATA = {
  "lastUpdate": 1761137642428,
  "repoUrl": "https://github.com/ptarmiganlabs/qvd4js",
  "entries": {
    "qvd4js Benchmark - macOS-ARM - Node 20.x": [
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
        "date": 1761127935569,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 462.68702156154944,
            "range": "±0.77%",
            "unit": "ops/sec",
            "extra": "461 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 10.805858264410324,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 4.0295788184420696,
            "range": "±0.48%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 84.55289285657906,
            "range": "±4.41%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 73.42341037593305,
            "range": "±4.65%",
            "unit": "ops/sec",
            "extra": "72 samples"
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
        "date": 1761128716740,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 445.05981979769734,
            "range": "±0.69%",
            "unit": "ops/sec",
            "extra": "444 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 10.600001018463786,
            "range": "±1.28%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 3.946084408604831,
            "range": "±0.44%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 84.6340174994023,
            "range": "±4.07%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 73.21256706481903,
            "range": "±4.50%",
            "unit": "ops/sec",
            "extra": "72 samples"
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
          "id": "9ba6f3363fbc34c9ad5eb6d631c6d38bbca8a740",
          "message": "Merge pull request #47 from ptarmiganlabs/copilot/replace-flaky-timing-tests",
          "timestamp": "2025-10-22T14:36:06+02:00",
          "tree_id": "759d06c652543d86239b18d8cc93431cd93ee6d0",
          "url": "https://github.com/ptarmiganlabs/qvd4js/commit/9ba6f3363fbc34c9ad5eb6d631c6d38bbca8a740"
        },
        "date": 1761137641423,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 451.50013123193366,
            "range": "±0.70%",
            "unit": "ops/sec",
            "extra": "450 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 10.616081493981687,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 4.018173758602286,
            "range": "±0.43%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 88.15266408260469,
            "range": "±3.69%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 76.66004607222536,
            "range": "±4.23%",
            "unit": "ops/sec",
            "extra": "76 samples"
          }
        ]
      }
    ]
  }
}