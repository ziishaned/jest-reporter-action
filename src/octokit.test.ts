//
// Copyright 2020 DXOS.org
//

import { Octokit } from '@octokit/core';

describe('ockokit tests', () => {

  test('auth', () => {
    // TODO(burdon): Create test app.
    // https://octokit.github.io/rest.js/v18#authentication
    // https://github.com/octokit/auth-action.js
    const octokit = new Octokit({});
    expect(octokit).toBeTruthy();
  });
});
