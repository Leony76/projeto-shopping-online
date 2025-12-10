type PropsType = {
  title: string;
  icon: any;
}

const Title = ({title, icon}:PropsType) => {
  return (
    <h1 className="title">{icon}{title}</h1>
  )
}

export default Title