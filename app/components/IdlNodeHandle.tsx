import React from 'react';
import { Handle, useNodeConnections } from '@xyflow/react';

const IdlNodeHandle = (props: any) => {
    console.log(props);
  const connections = useNodeConnections({
    handleType: props.type,
  });

  const connected = props.connectionCount ?? 1;

  console.log(connections);

  return (
    <Handle
      {...props}
      isConnectable={connections.length < connected }
    />
  );
};

export default IdlNodeHandle;



