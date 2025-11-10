import React, { memo } from 'react';
import { Position } from '@xyflow/react';

import IdlNodeHandle from './IdlNodeHandle';

const IdlNode = (props: any) => {
  return (
    <div>
      <IdlNodeHandle
        type="target"
        position={props.position}
        connectioncount={1}
      />
      <div>{props.label}</div>
    </div>
  );
};

export default memo(IdlNode);
