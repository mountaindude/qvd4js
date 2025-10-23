window.BENCHMARK_DATA = {
  "lastUpdate": 1761231203389,
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
        "date": 1761141513939,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 223.9750060364021,
            "range": "±0.91%",
            "unit": "ops/sec",
            "extra": "224 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 5.950298853424504,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 2.349047789069882,
            "range": "±0.44%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 63.06986674362079,
            "range": "±3.10%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 49.83310819686373,
            "range": "±0.37%",
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
          "id": "c82935a5a70c13cc5d2c678abe49cf063e4fc1f2",
          "message": "Merge pull request #51 from ptarmiganlabs/copilot/replace-flaky-timing-tests",
          "timestamp": "2025-10-22T16:34:21+02:00",
          "tree_id": "d736bea00e15b75e1cb30ed1d003604937629ea0",
          "url": "https://github.com/ptarmiganlabs/qvd4js/commit/c82935a5a70c13cc5d2c678abe49cf063e4fc1f2"
        },
        "date": 1761144469286,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 222.06334808107897,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "221 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 5.970342913028011,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 2.3279514972156385,
            "range": "±0.68%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 62.76626702628608,
            "range": "±3.34%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 50.160149797388925,
            "range": "±0.48%",
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
          "id": "b7b2336a2282bfcc734f46fe3a0eed7e4e9ba310",
          "message": "Merge pull request #52 from ptarmiganlabs/bugfix",
          "timestamp": "2025-10-22T17:32:22+02:00",
          "tree_id": "f3cada4b069512f59fb027f1a2e85a82911102ee",
          "url": "https://github.com/ptarmiganlabs/qvd4js/commit/b7b2336a2282bfcc734f46fe3a0eed7e4e9ba310"
        },
        "date": 1761147938120,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 230.37610465607028,
            "range": "±0.96%",
            "unit": "ops/sec",
            "extra": "230 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 5.962937492456762,
            "range": "±1.21%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 2.3311652916853594,
            "range": "±0.51%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 55.05286471040139,
            "range": "±5.73%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 49.083990700971725,
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
            "email": "goran@ptarmiganlabs.com",
            "name": "Göran Sander",
            "username": "mountaindude"
          },
          "distinct": true,
          "id": "a951eebffba1d5998024942b3f515bcf9fd08966",
          "message": "feat: add support for empty QVD files with detailed documentation and tests",
          "timestamp": "2025-10-23T14:00:51+02:00",
          "tree_id": "cb260b8f2c2896e9a031462e1a90d20730042d5f",
          "url": "https://github.com/ptarmiganlabs/qvd4js/commit/a951eebffba1d5998024942b3f515bcf9fd08966"
        },
        "date": 1761221777508,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 216.73538416113874,
            "range": "±1.08%",
            "unit": "ops/sec",
            "extra": "216 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 5.790431450027306,
            "range": "±1.43%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 2.29792315394609,
            "range": "±0.47%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 59.65839545403653,
            "range": "±4.40%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 49.7346775917415,
            "range": "±0.33%",
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
          "id": "48133f042e40543503fb066385f18163490fecb2",
          "message": "Merge pull request #54 from ptarmiganlabs/copilot/add-progress-callbacks-performance-improvements\n\nfeat: add progress callbacks and performance improvements for large QVD file writes",
          "timestamp": "2025-10-23T16:39:21+02:00",
          "tree_id": "95ee51c5597cb2be0a034e50a073708e8122deee",
          "url": "https://github.com/ptarmiganlabs/qvd4js/commit/48133f042e40543503fb066385f18163490fecb2"
        },
        "date": 1761231203363,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 232.96483202428746,
            "range": "±0.52%",
            "unit": "ops/sec",
            "extra": "233 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 6.006035920772657,
            "range": "±1.54%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 2.351180489988883,
            "range": "±0.45%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 57.22073185789348,
            "range": "±6.32%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 49.47333263453922,
            "range": "±0.32%",
            "unit": "ops/sec",
            "extra": "64 samples"
          }
        ]
      }
    ]
  }
}