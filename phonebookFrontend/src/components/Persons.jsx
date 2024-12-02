const Persons = ({ contactsToShow, handleDeletion }) => {
    return (
        contactsToShow.map( _ => <p key={ _.id }> {_.name} {_.number} 
        <button onClick={() => handleDeletion( _.id )}>delete</button> </p> )
    )
}

export default Persons