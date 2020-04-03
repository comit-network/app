export type Action = SetBTCBalance | SetETHBalance | SetDAIBalance;

interface SetBTCBalance {
  kind: 'setBTCBalance';
  value: boolean;
}

export const SetBTCBalance = (value: number): SetBTCBalance => ({
  kind: 'setBTCBalance',
  value
});

interface SetETHBalance {
  kind: 'setETHBalance';
  value: boolean;
}

export const SetETHBalance = (value: number): SetETHBalance => ({
  kind: 'setETHBalance',
  value
});

interface SetDAIBalance {
  kind: 'setDAIBalance';
  value: boolean;
}

export const SetDAIBalance = (value: number): SetDAIBalance => ({
  kind: 'setDAIBalance',
  value
});
