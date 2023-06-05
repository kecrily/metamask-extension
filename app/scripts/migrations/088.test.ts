import { migrate } from './088';

describe('migration #88', () => {
  it('updates the version metadata', async () => {
    const oldStorage = {
      meta: { version: 0 },
      data: {},
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.meta).toStrictEqual({ version: 88 });
  });

  it('returns the state unaltered if it has no NftController property', async () => {
    const oldData = {
      some: 'data',
    };
    const oldStorage = {
      meta: { version: 0 },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('returns the state unaltered if the NftController object has no allNftContracts property', async () => {
    const oldData = {
      NftController: {
        some: 'data',
      },
    };
    const oldStorage = {
      meta: { version: 0 },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('returns the state unaltered if NftController.allNftContracts is not an object', async () => {
    const oldData = {
      NftController: {
        allNftContracts: 'foo',
      },
    };
    const oldStorage = {
      meta: { version: 0 },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('returns the state unaltered if any value of the NftController.allNftContracts object is not an object itself', async () => {
    const oldData = {
      NftController: {
        allNftContracts: {
          '0x111': {
            '123': 'foo',
          },
          '0x222': 'bar',
        },
      },
    };
    const oldStorage = {
      meta: { version: 0 },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('rewrites NftController.allNftContracts so that decimal chain IDs are converted to hex strings', async () => {
    const oldStorage = {
      meta: { version: 0 },
      data: {
        NftController: {
          allNftContracts: {
            '0x111': {
              '16': ['contract 1', 'contract 2'],
              '32': ['contract 3', 'contract 4'],
            },
            '0x222': {
              '64': ['contract 5', 'contract 6'],
              '128': ['contract 7', 'contract 8'],
            },
          },
        },
      },
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual({
      NftController: {
        allNftContracts: {
          '0x111': {
            '0x10': ['contract 1', 'contract 2'],
            '0x20': ['contract 3', 'contract 4'],
          },
          '0x222': {
            '0x40': ['contract 5', 'contract 6'],
            '0x80': ['contract 7', 'contract 8'],
          },
        },
      },
    });
  });

  it('does not convert chain IDs in NftController.allNftContracts which are already hex strings', async () => {
    const oldStorage = {
      meta: { version: 0 },
      data: {
        NftController: {
          allNftContracts: {
            '0x111': {
              '0x10': ['contract 1', 'contract 2'],
              '0x20': ['contract 3', 'contract 4'],
            },
            '0x222': {
              '0x40': ['contract 5', 'contract 6'],
              '0x80': ['contract 7', 'contract 8'],
            },
          },
        },
      },
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual({
      NftController: {
        allNftContracts: {
          '0x111': {
            '0x10': ['contract 1', 'contract 2'],
            '0x20': ['contract 3', 'contract 4'],
          },
          '0x222': {
            '0x40': ['contract 5', 'contract 6'],
            '0x80': ['contract 7', 'contract 8'],
          },
        },
      },
    });
  });

  it('returns the state unaltered if the NftController object has no allNfts property', async () => {
    const oldData = {
      NftController: {
        some: 'data',
      },
    };
    const oldStorage = {
      meta: { version: 0 },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('returns the state unaltered if NftController.allNfts is not an object', async () => {
    const oldData = {
      NftController: {
        allNfts: 'foo',
      },
    };
    const oldStorage = {
      meta: { version: 0 },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('returns the state unaltered if any value of the NftController.allNfts object is not an object itself', async () => {
    const oldData = {
      NftController: {
        allNfts: {
          '0x111': {
            '123': 'foo',
          },
          '0x222': 'bar',
        },
      },
    };
    const oldStorage = {
      meta: { version: 0 },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('rewrites NftController.allNfts so that decimal chain IDs are converted to hex strings', async () => {
    const oldStorage = {
      meta: { version: 0 },
      data: {
        NftController: {
          allNfts: {
            '0x111': {
              '16': ['NFT 1', 'NFT 2'],
              '32': ['NFT 3', 'NFT 4'],
            },
            '0x222': {
              '64': ['NFT 5', 'NFT 6'],
              '128': ['NFT 7', 'NFT 8'],
            },
          },
        },
      },
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual({
      NftController: {
        allNfts: {
          '0x111': {
            '0x10': ['NFT 1', 'NFT 2'],
            '0x20': ['NFT 3', 'NFT 4'],
          },
          '0x222': {
            '0x40': ['NFT 5', 'NFT 6'],
            '0x80': ['NFT 7', 'NFT 8'],
          },
        },
      },
    });
  });

  it('does not convert chain IDs in NftController.allNfts which are already hex strings', async () => {
    const oldStorage = {
      meta: { version: 0 },
      data: {
        NftController: {
          allNfts: {
            '0x111': {
              '0x10': ['NFT 1', 'NFT 2'],
              '0x20': ['NFT 3', 'NFT 4'],
            },
            '0x222': {
              '0x40': ['NFT 5', 'NFT 6'],
              '0x80': ['NFT 7', 'NFT 8'],
            },
          },
        },
      },
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual({
      NftController: {
        allNfts: {
          '0x111': {
            '0x10': ['NFT 1', 'NFT 2'],
            '0x20': ['NFT 3', 'NFT 4'],
          },
          '0x222': {
            '0x40': ['NFT 5', 'NFT 6'],
            '0x80': ['NFT 7', 'NFT 8'],
          },
        },
      },
    });
  });

  it('returns the state unaltered if it has no TokenListController property', async () => {
    const oldData = {
      some: 'data',
    };
    const oldStorage = {
      meta: { version: 0 },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('returns the state unaltered if the TokenListController object has no tokensChainsCache property', async () => {
    const oldData = {
      TokenListController: {
        some: 'data',
      },
    };
    const oldStorage = {
      meta: { version: 0 },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('returns the state unaltered if TokenListController.tokensChainsCache is not an object', async () => {
    const oldData = {
      TokenListController: {
        tokensChainsCache: 'foo',
      },
    };
    const oldStorage = {
      meta: { version: 0 },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('rewrites TokenListController.tokensChainsCache so that decimal chain IDs are converted to hex strings', async () => {
    const oldStorage = {
      meta: { version: 0 },
      data: {
        TokenListController: {
          tokensChainsCache: {
            '16': 'cache 1',
            '32': 'cache 2',
          },
        },
      },
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual({
      TokenListController: {
        tokensChainsCache: {
          '0x10': 'cache 1',
          '0x20': 'cache 2',
        },
      },
    });
  });

  it('does not convert chain IDs in TokenListController.tokensChainsCache which are already hex strings', async () => {
    const oldStorage = {
      meta: { version: 0 },
      data: {
        TokenListController: {
          tokensChainsCache: {
            '0x10': 'cache 1',
            '0x20': 'cache 2',
          },
        },
      },
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual({
      TokenListController: {
        tokensChainsCache: {
          '0x10': 'cache 1',
          '0x20': 'cache 2',
        },
      },
    });
  });

  it('returns the state unaltered if it has no TokensController property', async () => {
    const oldData = {
      some: 'data',
    };
    const oldStorage = {
      meta: { version: 0 },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('returns the state unaltered if the TokensController object has no allTokens property', async () => {
    const oldData = {
      TokensController: {
        some: 'data',
      },
    };
    const oldStorage = {
      meta: { version: 0 },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('returns the state unaltered if TokensController.allTokens is not an object', async () => {
    const oldData = {
      TokensController: {
        allTokens: 'foo',
      },
    };
    const oldStorage = {
      meta: { version: 0 },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('rewrites TokensController.allTokens so that decimal chain IDs are converted to hex strings', async () => {
    const oldStorage = {
      meta: { version: 0 },
      data: {
        TokensController: {
          allTokens: {
            '16': 'object 1',
            '32': 'object 2',
          },
        },
      },
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual({
      TokensController: {
        allTokens: {
          '0x10': 'object 1',
          '0x20': 'object 2',
        },
      },
    });
  });

  it('does not convert chain IDs in TokensController.allTokens which are already hex strings', async () => {
    const oldStorage = {
      meta: { version: 0 },
      data: {
        TokensController: {
          allTokens: {
            '0x10': 'object 1',
            '0x20': 'object 2',
          },
        },
      },
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual({
      TokensController: {
        allTokens: {
          '0x10': 'object 1',
          '0x20': 'object 2',
        },
      },
    });
  });

  it('returns the state unaltered if the TokensController object has no allIgnoredTokens property', async () => {
    const oldData = {
      TokensController: {
        some: 'data',
      },
    };
    const oldStorage = {
      meta: { version: 0 },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('returns the state unaltered if TokensController.allIgnoredTokens is not an object', async () => {
    const oldData = {
      TokensController: {
        allIgnoredTokens: 'foo',
      },
    };
    const oldStorage = {
      meta: { version: 0 },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('rewrites TokensController.allIgnoredTokens so that decimal chain IDs are converted to hex strings', async () => {
    const oldStorage = {
      meta: { version: 0 },
      data: {
        TokensController: {
          allIgnoredTokens: {
            '16': 'object 1',
            '32': 'object 2',
          },
        },
      },
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual({
      TokensController: {
        allIgnoredTokens: {
          '0x10': 'object 1',
          '0x20': 'object 2',
        },
      },
    });
  });

  it('does not convert chain IDs in TokensController.allIgnoredTokens which are already hex strings', async () => {
    const oldStorage = {
      meta: { version: 0 },
      data: {
        TokensController: {
          allIgnoredTokens: {
            '0x10': 'object 1',
            '0x20': 'object 2',
          },
        },
      },
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual({
      TokensController: {
        allIgnoredTokens: {
          '0x10': 'object 1',
          '0x20': 'object 2',
        },
      },
    });
  });

  it('returns the state unaltered if the TokensController object has no allDetectedTokens property', async () => {
    const oldData = {
      TokensController: {
        some: 'data',
      },
    };
    const oldStorage = {
      meta: { version: 0 },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('returns the state unaltered if TokensController.allDetectedTokens is not an object', async () => {
    const oldData = {
      TokensController: {
        allDetectedTokens: 'foo',
      },
    };
    const oldStorage = {
      meta: { version: 0 },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('rewrites TokensController.allDetectedTokens so that decimal chain IDs are converted to hex strings', async () => {
    const oldStorage = {
      meta: { version: 0 },
      data: {
        TokensController: {
          allDetectedTokens: {
            '16': 'object 1',
            '32': 'object 2',
          },
        },
      },
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual({
      TokensController: {
        allDetectedTokens: {
          '0x10': 'object 1',
          '0x20': 'object 2',
        },
      },
    });
  });

  it('does not convert chain IDs in TokensController.allDetectedTokens which are already hex strings', async () => {
    const oldStorage = {
      meta: { version: 0 },
      data: {
        TokensController: {
          allDetectedTokens: {
            '0x10': 'object 1',
            '0x20': 'object 2',
          },
        },
      },
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.data).toStrictEqual({
      TokensController: {
        allDetectedTokens: {
          '0x10': 'object 1',
          '0x20': 'object 2',
        },
      },
    });
  });
});
