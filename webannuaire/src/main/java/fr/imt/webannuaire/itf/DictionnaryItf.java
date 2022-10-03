package fr.imt.webannuaire.itf;

import java.util.Collection;

import fr.imt.webannuaire.data.Person;

public interface DictionnaryItf {

    public Collection<Person> getAll();
    public Person getFromId(int id);
    public boolean deleteFromId(int id);
    public void addPerson(Person p);

}
