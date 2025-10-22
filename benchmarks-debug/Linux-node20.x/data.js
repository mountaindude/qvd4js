window.BENCHMARK_DATA = {
  "lastUpdate": 1761138563714,
  "repoUrl": "https://github.com/ptarmiganlabs/qvd4js",
  "entries": {
    "qvd4js Benchmark - Linux - Node 20.x [DEBUG]": [
      {
        "commit": {
          "author": {
            "name": "Göran Sander",
            "username": "mountaindude",
            "email": "goran@ptarmiganlabs.com"
          },
          "committer": {
            "name": "Göran Sander",
            "username": "mountaindude",
            "email": "goran@ptarmiganlabs.com"
          },
          "id": "8af78c2c06d4e180247cc39e6e1d4bbd7d171c7a",
          "message": "feat: add benchmark-debug workflow for fast feedback on benchmark issues",
          "timestamp": "2025-10-22T13:05:23Z",
          "url": "https://github.com/ptarmiganlabs/qvd4js/commit/8af78c2c06d4e180247cc39e6e1d4bbd7d171c7a"
        },
        "date": 1761138562724,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 162.58682565840073,
            "range": "±3.05%",
            "unit": "ops/sec",
            "extra": "160 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 4.018581048944866,
            "range": "±0.98%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 1.4646109752036347,
            "range": "±0.14%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 37.88769360793699,
            "range": "±7.00%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 28.716169524126542,
            "range": "±5.75%",
            "unit": "ops/sec",
            "extra": "64 samples"
          }
        ]
      }
    ]
  }
}