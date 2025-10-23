window.BENCHMARK_DATA = {
  "lastUpdate": 1761231203193,
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
        "date": 1761137559228,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 171.95238047152645,
            "range": "±0.80%",
            "unit": "ops/sec",
            "extra": "172 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 4.246660294610602,
            "range": "±0.89%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 1.5583288341539885,
            "range": "±0.25%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 43.74576179129655,
            "range": "±6.99%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 32.0431214990533,
            "range": "±5.53%",
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
        "date": 1761139244770,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 183.48698393969426,
            "range": "±0.60%",
            "unit": "ops/sec",
            "extra": "184 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 4.300373917754724,
            "range": "±0.99%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 1.5730192294764516,
            "range": "±0.22%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 44.101830530681525,
            "range": "±6.27%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 32.94857443647089,
            "range": "±6.03%",
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
        "date": 1761141491753,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 184.82422328383768,
            "range": "±0.47%",
            "unit": "ops/sec",
            "extra": "185 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 4.3353367443507915,
            "range": "±0.85%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 1.57240420678537,
            "range": "±0.40%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 44.253429462056936,
            "range": "±6.36%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 32.34278558189742,
            "range": "±5.13%",
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
        "date": 1761144469083,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 183.54422298302333,
            "range": "±0.53%",
            "unit": "ops/sec",
            "extra": "184 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 4.329578209943079,
            "range": "±0.85%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 1.585149586275283,
            "range": "±0.25%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 44.68146996708325,
            "range": "±6.33%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 33.055544648061414,
            "range": "±5.10%",
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
        "date": 1761147937920,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 180.1223617694213,
            "range": "±0.60%",
            "unit": "ops/sec",
            "extra": "180 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 4.368827286562665,
            "range": "±0.84%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 1.5921315201379933,
            "range": "±0.23%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 45.46985048232735,
            "range": "±6.42%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 32.90742637934592,
            "range": "±5.01%",
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
        "date": 1761221776998,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 184.21836674928525,
            "range": "±0.62%",
            "unit": "ops/sec",
            "extra": "184 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 4.342527559683518,
            "range": "±0.82%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 1.5888532498960506,
            "range": "±0.26%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 44.39873561639065,
            "range": "±6.34%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 33.1662324529325,
            "range": "±4.91%",
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
        "date": 1761231203166,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 183.0135981605526,
            "range": "±0.61%",
            "unit": "ops/sec",
            "extra": "183 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 4.329593782104664,
            "range": "±0.89%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 1.585974202225004,
            "range": "±0.21%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 45.17214347700251,
            "range": "±6.43%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 33.00932079766131,
            "range": "±5.65%",
            "unit": "ops/sec",
            "extra": "64 samples"
          }
        ]
      }
    ]
  }
}