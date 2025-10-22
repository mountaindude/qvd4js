window.BENCHMARK_DATA = {
  "lastUpdate": 1761139256846,
  "repoUrl": "https://github.com/ptarmiganlabs/qvd4js",
  "entries": {
    "qvd4js Benchmark - Linux - Node 24.x": [
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
        "date": 1761127953782,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 219.98821462359504,
            "range": "±1.36%",
            "unit": "ops/sec",
            "extra": "219 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 5.951121904610794,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 2.3464427440765445,
            "range": "±0.57%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 61.46297828866954,
            "range": "±2.76%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 49.10948221679092,
            "range": "±0.55%",
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
        "date": 1761128572127,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 219.73323630866523,
            "range": "±3.55%",
            "unit": "ops/sec",
            "extra": "212 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 6.0626111105160465,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 2.361589910935339,
            "range": "±0.58%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 54.87026276052909,
            "range": "±6.72%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 48.75892181028946,
            "range": "±0.41%",
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
          "id": "9ba6f3363fbc34c9ad5eb6d631c6d38bbca8a740",
          "message": "Merge pull request #47 from ptarmiganlabs/copilot/replace-flaky-timing-tests",
          "timestamp": "2025-10-22T14:36:06+02:00",
          "tree_id": "759d06c652543d86239b18d8cc93431cd93ee6d0",
          "url": "https://github.com/ptarmiganlabs/qvd4js/commit/9ba6f3363fbc34c9ad5eb6d631c6d38bbca8a740"
        },
        "date": 1761137568603,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 221.2964318597066,
            "range": "±1.82%",
            "unit": "ops/sec",
            "extra": "220 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 6.049349528822854,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 2.348278661772726,
            "range": "±0.56%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 54.61163104338822,
            "range": "±6.42%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 48.401749838749275,
            "range": "±0.60%",
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
        "date": 1761139255814,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 223.0212058150074,
            "range": "±2.91%",
            "unit": "ops/sec",
            "extra": "218 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 6.037017408248823,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 2.346828831500679,
            "range": "±0.43%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 62.37493439905682,
            "range": "±4.34%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 49.86197411887198,
            "range": "±0.38%",
            "unit": "ops/sec",
            "extra": "64 samples"
          }
        ]
      }
    ]
  }
}