export default function AIR_Button({ text }) {
  return (
    <div style={{
      padding: 11,
      border: 'none',
      borderRadius: '4px',
      background: 'var(--main)',
      color: 'white',
      textAlign: 'center',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'red',
        cursor: 'pointer'
      },
    }}> {text}</div >
  )
}