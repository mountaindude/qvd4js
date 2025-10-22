window.BENCHMARK_DATA = {
  "lastUpdate": 1761137591047,
  "repoUrl": "https://github.com/ptarmiganlabs/qvd4js",
  "entries": {
    "qvd4js Benchmark - Windows - Node 22.x": [
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
        "date": 1761137590017,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Parse small QVD (~600 rows)",
            "value": 69.03340481018967,
            "range": "±8.11%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse medium QVD (~18k rows)",
            "value": 1.9547198373559729,
            "range": "±5.43%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse large QVD (~60k rows)",
            "value": 0.7133772345219301,
            "range": "±3.35%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=100 (lazy loading)",
            "value": 13.179704309671969,
            "range": "±6.44%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Parse with maxRows=1000 (lazy loading)",
            "value": 14.01297984797656,
            "range": "±8.02%",
            "unit": "ops/sec",
            "extra": "64 samples"
          }
        ]
      }
    ]
  }
}