window.BENCHMARK_DATA = {
  "lastUpdate": 1761147939722,
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
        "date": 1761128568582,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 487.7738652559736,
            "range": "±0.44%",
            "unit": "ops/sec",
            "extra": "487 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 11.245834512932202,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 4.066691732637596,
            "range": "±0.43%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 104.68014263958831,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "103 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 80.92018097806269,
            "range": "±2.68%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
        "date": 1761137652318,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 485.23656544471066,
            "range": "±0.35%",
            "unit": "ops/sec",
            "extra": "485 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 11.197878059382605,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 4.05784093543921,
            "range": "±0.44%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 108.37025239341705,
            "range": "±3.82%",
            "unit": "ops/sec",
            "extra": "106 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 84.73000945752185,
            "range": "±2.49%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
        "date": 1761139346907,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 479.57316025947586,
            "range": "±0.30%",
            "unit": "ops/sec",
            "extra": "480 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 11.116648935447817,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 4.021509807682557,
            "range": "±0.40%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 102.64361315153864,
            "range": "±3.71%",
            "unit": "ops/sec",
            "extra": "101 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 81.3425644274587,
            "range": "±2.80%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
          "id": "fe6b951c78365428b997da0d90498f83bb36ddd5",
          "message": "Merge pull request #49 from ptarmiganlabs/copilot/replace-flaky-timing-tests",
          "timestamp": "2025-10-22T15:44:40+02:00",
          "tree_id": "de68c01ee5d7262adc6ffad11c9552d7e50a7344",
          "url": "https://github.com/ptarmiganlabs/qvd4js/commit/fe6b951c78365428b997da0d90498f83bb36ddd5"
        },
        "date": 1761141596975,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 483.23178461605477,
            "range": "±0.38%",
            "unit": "ops/sec",
            "extra": "483 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 11.08818071876023,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 4.029567806197236,
            "range": "±0.44%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 103.81243511819848,
            "range": "±3.83%",
            "unit": "ops/sec",
            "extra": "102 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 81.70949405204406,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
          "id": "c82935a5a70c13cc5d2c678abe49cf063e4fc1f2",
          "message": "Merge pull request #51 from ptarmiganlabs/copilot/replace-flaky-timing-tests",
          "timestamp": "2025-10-22T16:34:21+02:00",
          "tree_id": "d736bea00e15b75e1cb30ed1d003604937629ea0",
          "url": "https://github.com/ptarmiganlabs/qvd4js/commit/c82935a5a70c13cc5d2c678abe49cf063e4fc1f2"
        },
        "date": 1761144470942,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 496.7060548026223,
            "range": "±0.30%",
            "unit": "ops/sec",
            "extra": "497 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 11.471681125855822,
            "range": "±1.15%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 4.10952092306847,
            "range": "±0.48%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 104.63475257779972,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "103 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 84.20724701849035,
            "range": "±2.39%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "b7b2336a2282bfcc734f46fe3a0eed7e4e9ba310",
          "message": "Merge pull request #52 from ptarmiganlabs/bugfix",
          "timestamp": "2025-10-22T17:32:22+02:00",
          "tree_id": "f3cada4b069512f59fb027f1a2e85a82911102ee",
          "url": "https://github.com/ptarmiganlabs/qvd4js/commit/b7b2336a2282bfcc734f46fe3a0eed7e4e9ba310"
        },
        "date": 1761147939696,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 482.18822240272067,
            "range": "±0.28%",
            "unit": "ops/sec",
            "extra": "482 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 11.199110176221833,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 4.0383609259546835,
            "range": "±0.43%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 103.21608533081726,
            "range": "±2.98%",
            "unit": "ops/sec",
            "extra": "102 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 80.49619500559028,
            "range": "±2.86%",
            "unit": "ops/sec",
            "extra": "80 samples"
          }
        ]
      }
    ]
  }
}