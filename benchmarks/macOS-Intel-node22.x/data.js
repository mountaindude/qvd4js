window.BENCHMARK_DATA = {
  "lastUpdate": 1761231204364,
  "repoUrl": "https://github.com/ptarmiganlabs/qvd4js",
  "entries": {
    "qvd4js Benchmark - macOS-Intel - Node 22.x": [
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
        "date": 1761137621760,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 131.28438785837264,
            "range": "±2.47%",
            "unit": "ops/sec",
            "extra": "130 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 3.0962018638587563,
            "range": "±3.59%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 1.1707926772824642,
            "range": "±1.27%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 29.57223137142592,
            "range": "±6.48%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 23.212071100594432,
            "range": "±5.95%",
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
        "date": 1761139310512,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 126.71339383851347,
            "range": "±2.27%",
            "unit": "ops/sec",
            "extra": "126 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 3.1022188388197245,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 1.1828065958479306,
            "range": "±0.62%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 29.265364968567777,
            "range": "±5.98%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 22.91563762326884,
            "range": "±5.06%",
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
        "date": 1761141567684,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 126.0596371610376,
            "range": "±2.31%",
            "unit": "ops/sec",
            "extra": "125 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 3.1044703892932097,
            "range": "±1.86%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 1.134109957411863,
            "range": "±5.11%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 28.28403642500096,
            "range": "±7.40%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 22.382792399931944,
            "range": "±6.62%",
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
        "date": 1761144470316,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 127.3092274707273,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "126 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 3.101928979389211,
            "range": "±1.22%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 1.185371442754693,
            "range": "±0.55%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 28.586125839827893,
            "range": "±6.67%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 23.58381057699281,
            "range": "±4.74%",
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
        "date": 1761147939123,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 126.08545487612551,
            "range": "±2.17%",
            "unit": "ops/sec",
            "extra": "125 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 3.0498570416558595,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 1.1752947115396408,
            "range": "±0.36%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 28.97961844214178,
            "range": "±5.92%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 22.466075584674925,
            "range": "±5.17%",
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
        "date": 1761221778459,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 129.19695849588217,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "128 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 2.8958074389014636,
            "range": "±9.70%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 1.175852156753106,
            "range": "±0.80%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 27.741145275643518,
            "range": "±6.46%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 23.395844128346265,
            "range": "±4.92%",
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
        "date": 1761231204338,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 136.35975355519236,
            "range": "±2.01%",
            "unit": "ops/sec",
            "extra": "136 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 3.1675814596866947,
            "range": "±0.75%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 1.1901481031174428,
            "range": "±0.49%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 28.340632162408813,
            "range": "±6.23%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 22.495954217377133,
            "range": "±6.13%",
            "unit": "ops/sec",
            "extra": "64 samples"
          }
        ]
      }
    ]
  }
}