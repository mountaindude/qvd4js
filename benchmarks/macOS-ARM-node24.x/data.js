window.BENCHMARK_DATA = {
  "lastUpdate": 1761139355202,
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
        "date": 1761137662075,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 623.2077696667116,
            "range": "±0.20%",
            "unit": "ops/sec",
            "extra": "623 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 14.859857890960113,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 5.986205699645797,
            "range": "±0.63%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 147.1123976696595,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "147 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 125.69472124895009,
            "range": "±0.42%",
            "unit": "ops/sec",
            "extra": "126 samples"
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
        "date": 1761139354784,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 630.1523780540789,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "630 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 14.938286956191474,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 5.936420270039558,
            "range": "±0.66%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 145.26100055372856,
            "range": "±0.93%",
            "unit": "ops/sec",
            "extra": "145 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 122.39297499786277,
            "range": "±0.31%",
            "unit": "ops/sec",
            "extra": "123 samples"
          }
        ]
      }
    ]
  }
}