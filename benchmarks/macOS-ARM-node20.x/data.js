window.BENCHMARK_DATA = {
  "lastUpdate": 1761231204767,
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
        "date": 1761139337686,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 468.4637346012607,
            "range": "±0.30%",
            "unit": "ops/sec",
            "extra": "469 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 10.69653040454625,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 4.00655787739673,
            "range": "±0.44%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 85.09652388578625,
            "range": "±3.68%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 73.74603858848742,
            "range": "±4.43%",
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
          "id": "fe6b951c78365428b997da0d90498f83bb36ddd5",
          "message": "Merge pull request #49 from ptarmiganlabs/copilot/replace-flaky-timing-tests",
          "timestamp": "2025-10-22T15:44:40+02:00",
          "tree_id": "de68c01ee5d7262adc6ffad11c9552d7e50a7344",
          "url": "https://github.com/ptarmiganlabs/qvd4js/commit/fe6b951c78365428b997da0d90498f83bb36ddd5"
        },
        "date": 1761141586824,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 464.47160607338793,
            "range": "±0.74%",
            "unit": "ops/sec",
            "extra": "463 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 10.853222379872848,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 4.049338020371227,
            "range": "±0.48%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 85.5151968614034,
            "range": "±3.85%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 74.59537262325703,
            "range": "±4.46%",
            "unit": "ops/sec",
            "extra": "73 samples"
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
        "date": 1761144470735,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 470.379845536088,
            "range": "±0.29%",
            "unit": "ops/sec",
            "extra": "470 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 10.646244693233562,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 4.005100655410287,
            "range": "±0.41%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 84.78652201411604,
            "range": "±4.15%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 73.633511342188,
            "range": "±4.45%",
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
          "id": "b7b2336a2282bfcc734f46fe3a0eed7e4e9ba310",
          "message": "Merge pull request #52 from ptarmiganlabs/bugfix",
          "timestamp": "2025-10-22T17:32:22+02:00",
          "tree_id": "f3cada4b069512f59fb027f1a2e85a82911102ee",
          "url": "https://github.com/ptarmiganlabs/qvd4js/commit/b7b2336a2282bfcc734f46fe3a0eed7e4e9ba310"
        },
        "date": 1761147939511,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 464.134294227335,
            "range": "±0.43%",
            "unit": "ops/sec",
            "extra": "464 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 10.637109642702942,
            "range": "±1.31%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 3.986472144356493,
            "range": "±0.43%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 84.76569909662973,
            "range": "±3.70%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 73.01145010523884,
            "range": "±4.71%",
            "unit": "ops/sec",
            "extra": "71 samples"
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
        "date": 1761221778837,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 471.4298800997833,
            "range": "±0.33%",
            "unit": "ops/sec",
            "extra": "471 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 10.750277688700713,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 4.028168150850013,
            "range": "±0.43%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 85.88623079136383,
            "range": "±3.82%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 73.77099965462509,
            "range": "±4.74%",
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
          "id": "48133f042e40543503fb066385f18163490fecb2",
          "message": "Merge pull request #54 from ptarmiganlabs/copilot/add-progress-callbacks-performance-improvements\n\nfeat: add progress callbacks and performance improvements for large QVD file writes",
          "timestamp": "2025-10-23T16:39:21+02:00",
          "tree_id": "95ee51c5597cb2be0a034e50a073708e8122deee",
          "url": "https://github.com/ptarmiganlabs/qvd4js/commit/48133f042e40543503fb066385f18163490fecb2"
        },
        "date": 1761231204741,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 404.74260309833437,
            "range": "±0.86%",
            "unit": "ops/sec",
            "extra": "403 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 10.347438091095851,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 4.00874776364564,
            "range": "±0.42%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 85.85717532211352,
            "range": "±3.75%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 73.23136549211812,
            "range": "±4.76%",
            "unit": "ops/sec",
            "extra": "71 samples"
          }
        ]
      }
    ]
  }
}