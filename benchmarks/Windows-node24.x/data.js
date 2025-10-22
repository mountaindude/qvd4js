window.BENCHMARK_DATA = {
  "lastUpdate": 1761137599766,
  "repoUrl": "https://github.com/ptarmiganlabs/qvd4js",
  "entries": {
    "qvd4js Benchmark - Windows - Node 24.x": [
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
        "date": 1761137599349,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 88.22316864723402,
            "range": "±3.87%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 2.1335330874082956,
            "range": "±6.56%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 0.7885230361557082,
            "range": "±3.84%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 25.441588372117025,
            "range": "±7.47%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 23.17912157354612,
            "range": "±4.21%",
            "unit": "ops/sec",
            "extra": "64 samples"
          }
        ]
      }
    ]
  }
}