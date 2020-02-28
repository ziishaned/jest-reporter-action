# Jest reporter action

This action comments a pull request with the jest code coverage.

![jest-reporter-action](shot.png)

## Inputs

### `github-token`

**Required** Github token.

### `lcov-file`

**Optional** The location of the lcov file to parse. Defaults to
`./coverage/lcov.info`

## Example usage

```yml
uses: romeovs/lcov-reporter-action@v0.2.6
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
  lcov-file: ./coverage/lcov.info
```
