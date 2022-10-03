package fr.imt.webannuaire.service;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import fr.imt.webannuaire.data.Person;
import fr.imt.webannuaire.itf.DictionnaryItf;

@Service
public class DictionnaryService implements DictionnaryItf {

    Map<Integer,Person> hm;

    public DictionnaryService() {
        super();
        hm = new HashMap<Integer,Person>();
        hm.put(1, new Person(1,"Who", "Doctor", "0606060606", "Lille"));
        hm.put(2, new Person(2,"Bond", "James", "0606060606", "Londres"));
        hm.put(3, new Person(3,"Macron", "Emmanuel", "0606060606", "Paris"));
    }

    @Override
    public Collection<Person> getAll() {
        return (Collection<Person>) (hm.values());
    }

    @Override
    public Person getFromId(int id) {
        return hm.get(id);
    }

    @Override
    public boolean deleteFromId(int id) {
        if(hm.remove(id) != null) return true;
        return false;
    }

    @Override
    public void addPerson(Person p) {
        hm.put(p.getId(), p);
    }

}
