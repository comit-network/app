export type Action = SetBTCBalance | SetETHBalance | SetDAIBalance;

interface SetBTCBalance {
  kind: 'setBTCBalance';
  value: boolean;
}

export const setBTCBalance = (value: number): SetBTCBalance => ({
  kind: 'setBTCBalance',
  value
});

interface SetETHBalance {
  kind: 'setETHBalance';
  value: boolean;
}

export const setETHBalance = (value: number): SetETHBalance => ({
  kind: 'setETHBalance',
  value
});

interface SetDAIBalance {
  kind: 'setDAIBalance';
  value: boolean;
}

export const setDAIBalance = (value: number): SetDAIBalance => ({
  kind: 'setDAIBalance',
  value
});
