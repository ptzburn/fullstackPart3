import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import contactService from './services/contacts'

import { useState, useEffect } from 'react'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [error, setError] = useState(false)

  const hook = () => {
    contactService
      .getAll()
      .then(initialContacts => {
        setPersons(initialContacts)
      })
  }

  useEffect(hook, [])

  const addContact = (event) => {
    event.preventDefault()
    const newContact = {
      name: newName,
      number: newNumber
    }

    if (persons.find( _ => _.name === newName )) {
      const matched = persons.find( _ => _.name === newName )
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        contactService
          .update(matched.id, {...matched, number: newNumber})
          .then(returnedContact => {
            setNotificationMessage(`The number of ${newName} changed to ${newNumber}`)
            setTimeout(() => {setNotificationMessage(null)}, 5000)
            setPersons(persons.map(contact => contact.id === matched.id ? returnedContact : contact))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setError(true)
            setNotificationMessage(`${error.response.data.error}`)
            setTimeout(() => {setNotificationMessage(null), setError(false)}, 5000)
          })
          
      }
      return
    }
    

    contactService
      .create(newContact)
      .then(returnedContact => {
        setNotificationMessage(`Added ${newName}`)
        setTimeout(() => {setNotificationMessage(null)}, 5000)
        setPersons(persons.concat(returnedContact))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setError(true)
        setNotificationMessage(`${error.response.data.error}`)
        setTimeout(() => {setNotificationMessage(null), setError(false)}, 5000)
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const handleDeletion = id => {
    const contact = persons.find(n => n.id === id)

    if (window.confirm(`Delete ${contact.name}?`)) {
      contactService.remove(id)
        .then(() => setPersons(persons.filter( _ => _.id !== id)))
        .catch(error => {
          setError(true)
          setNotificationMessage(`${contact.name} has already been removed from the server`)
          setTimeout(() => {setNotificationMessage(null), setError(false)}, 5000)
        })

    }


  }

  const contactsToShow = persons.filter( _ => _.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} isError={error} />
      <Filter value={search} onChange={handleSearch}/>
      <h2>Add a new</h2>
      <PersonForm 
        addContact={addContact} newName={newName} newNumber={newNumber}
        handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons contactsToShow={contactsToShow} handleDeletion={handleDeletion} />
    </div>
  )
}

export default App
