import React from 'react';

export default function PrefixedSlugInput(props) {
  const urlPrefix = props?.schemaType?.options?.urlPrefix || 'omelet.com/'

  return (
    <div>
      <div style={{marginBottom: 8, fontSize: 12, lineHeight: 1.4, opacity: 0.75}}>
        URL prefix: <strong>{urlPrefix}</strong>
      </div>
      {props.renderDefault(props)}
    </div>
  )
}
