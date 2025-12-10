type PropsType = {
  title: string;
}

const SectionTitle = ({title}:PropsType) => {
  return (
    <div className="section-title" style={{
        gap: title === '' ? '0'  : '10px', 
        marginTop:  title === '' ? '10px' : '0'
      }}>
      <div className="section-title-decoration"></div>
      {title !== '' && (
        <h2 className="section-title-title">{title}</h2>
      )}
      <div className="section-title-decoration"></div>
    </div>
  )
}

export default SectionTitle