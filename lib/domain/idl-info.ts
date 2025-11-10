type instruction = {
  name: string;
  docs: string[];
  accounts: account[];
  args: args[];
};

type account = {
  name: string;
  isMut: boolean;
  isSigner: boolean;
};

type args = {
  name: string;
  type: string;
};

type idlProgram = {
  version: string;
  name: string;
  instructions: instruction[];
  accounts: account[];
};
