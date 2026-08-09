// modules/player/generation/names.js
(() => {
  const NAME_POOLS = {
    PL: {
      first: ['Jan','Piotr','Kacper','Michał','Jakub','Szymon','Mateusz','Filip','Wojciech','Bartosz','Damian','Patryk','Adrian','Paweł','Tomasz','Marcin','Sebastian','Rafał','Łukasz','Grzegorz','Maciej','Karol','Oskar','Antoni','Franciszek','Aleksander','Ignacy','Maksymilian','Nikodem','Wiktor','Hubert','Dominik','Natan','Ksawery','Igor','Alan','Artur','Cezary','Dawid','Emil','Juliusz','Konrad','Leon','Mikołaj','Norbert','Przemysław','Radosław','Stanisław','Tymon','Zbigniew'],
      last: ['Nowak','Kowalski','Wiśniewski','Wójcik','Kamiński','Lewandowski','Zieliński','Szymański','Woźniak','Dąbrowski','Kozłowski','Jankowski','Mazur','Wojciechowski','Kwiatkowski','Krawczyk','Kaczmarek','Piotrowski','Grabowski','Nowicki','Pawłowski','Michalski','Król','Wieczorek','Jabłoński','Wróbel','Majewski','Olszewski','Stępień','Malinowski','Adamczyk','Dudek','Górski','Pawlak','Walczak','Rutkowski','Sikora','Baran','Szewczyk','Urbański','Lis','Musiał','Bąk','Czarnecki','Sawicki','Mróz','Kurek','Mucha','Zając','Wilk']
    },
    DE: {
      first: ['Lukas','Leon','Finn','Paul','Noah','Felix','Jonas','Elias','Maximilian','Ben','Julian','Tim','Moritz','Niklas','David','Simon','Fabian','Nico','Tobias','Marcel','Florian','Philipp','Johannes','Matthias','Henrik','Jakob','Emil','Oskar','Theo','Anton','Luis','Mika','Jannis','Robin','Sven','Kai','Dominik','Raphael','Vincent','Adrian','Daniel','Christian','Sebastian','Stefan','Andreas','Kevin','Dennis','Alexander','Bastian','Michael'],
      last: ['Müller','Schmidt','Schneider','Fischer','Weber','Meyer','Wagner','Becker','Schulz','Hoffmann','Schäfer','Koch','Bauer','Richter','Klein','Wolf','Schröder','Neumann','Schwarz','Zimmermann','Braun','Krüger','Hartmann','Lange','Schmitt','Werner','Schmitz','Krause','Meier','Lehmann','Schmid','Schulze','Maier','Köhler','Herrmann','König','Walter','Mayer','Huber','Kaiser','Fuchs','Peters','Lang','Scholz','Möller','Weiß','Jung','Hahn','Vogel','Sommer']
    },
    ES: {
      first: ['Hugo','Pablo','Lucas','Martín','Mateo','Diego','Alejandro','Javier','Adrián','Daniel','David','Sergio','Álvaro','Mario','Iker','Iván','Rubén','Raúl','Ángel','Carlos','Enrique','Fernando','Gonzalo','Joaquín','Jesús','Manuel','Miguel','Nicolás','Óscar','Ramón','Samuel','Tomás','Víctor','Yeray','Bruno','Gael','Leo','Marcos','Néstor','Pau','Quique','Rafael','Saúl','Teo','Unai','Valentín','Xabier','Yago','Borja','César'],
      last: ['García','Martínez','López','Sánchez','Pérez','Gómez','Fernández','Ruiz','Díaz','Moreno','Álvarez','Muñoz','Romero','Alonso','Gutiérrez','Navarro','Torres','Domínguez','Vázquez','Ramos','Gil','Serrano','Blanco','Molina','Morales','Suárez','Ortega','Delgado','Castro','Ortiz','Rubio','Marín','Sanz','Núñez','Iglesias','Medina','Garrido','Cortés','Castillo','Santos','Lozano','Guerrero','Cano','Prieto','Méndez','Calvo','Cruz','Vega','Herrera','Peña']
    },
    IT: {
      first: ['Luca','Matteo','Leonardo','Francesco','Alessandro','Andrea','Gabriele','Riccardo','Tommaso','Davide','Federico','Giuseppe','Marco','Niccolò','Lorenzo','Edoardo','Samuele','Christian','Simone','Antonio','Filippo','Pietro','Michele','Giovanni','Salvatore','Daniele','Fabio','Stefano','Massimo','Claudio','Domenico','Enrico','Giacomo','Paolo','Raffaele','Vincenzo','Alberto','Carlo','Diego','Elia','Giorgio','Ignazio','Jacopo','Kevin','Luigi','Manuel','Nicolò','Orlando','Roberto','Valerio'],
      last: ['Rossi','Russo','Ferrari','Esposito','Bianchi','Romano','Colombo','Ricci','Marino','Greco','Bruno','Gallo','Conti','De Luca','Mancini','Costa','Giordano','Rizzo','Lombardi','Moretti','Barbieri','Fontana','Santoro','Mariani','Rinaldi','Caruso','Ferrara','Galli','Martini','Leone','Longo','Gentile','Martinelli','Vitale','Lombardo','Serra','Coppola','De Santis','D Angelo','Parisi','Villa','Conte','Fabbri','Bianco','Testa','Pellegrini','Fiore','Benedetti','Monti','Sanna']
    },
    FR: {
      first: ['Louis','Jules','Gabriel','Arthur','Léo','Hugo','Lucas','Nathan','Enzo','Raphaël','Mathis','Tom','Antoine','Clément','Maxime','Paul','Théo','Ethan','Noah','Adam','Baptiste','Corentin','Damien','Étienne','Florian','Grégoire','Henri','Ismaël','Julien','Kylian','Loïc','Maël','Nicolas','Olivier','Quentin','Romain','Sacha','Tristan','Valentin','Yanis','Aurélien','Benjamin','Charles','Dorian','Emmanuel','Fabien','Gaëtan','Ilyes','Joachim','Kevin'],
      last: ['Martin','Bernard','Dubois','Thomas','Robert','Richard','Petit','Durand','Leroy','Moreau','Simon','Laurent','Lefebvre','Michel','Garcia','David','Bertrand','Roux','Vincent','Fournier','Morel','Girard','Andre','Lefevre','Mercier','Dupont','Lambert','Bonnet','Francois','Martinez','Legrand','Garnier','Faure','Rousseau','Blanc','Guerin','Muller','Henry','Roussel','Nicolas','Perrin','Morin','Mathieu','Clement','Gauthier','Dumont','Lopez','Fontaine','Chevalier','Robin']
    },
    GB: {
      first: ['Oliver','George','Harry','Jack','Noah','Charlie','Jacob','Alfie','Thomas','Oscar','William','James','Leo','Henry','Joshua','Freddie','Archie','Ethan','Isaac','Alexander','Logan','Lucas','Mason','Theo','Harrison','Samuel','Adam','Benjamin','Callum','Daniel','Edward','Finley','Gabriel','Harvey','Isaiah','Joseph','Kyle','Lewis','Matthew','Nathan','Owen','Reuben','Ryan','Sebastian','Toby','Umar','Victor','Wesley','Xavier','Zachary'],
      last: ['Smith','Jones','Taylor','Brown','Williams','Wilson','Johnson','Davies','Patel','Wright','Walker','White','Edwards','Hughes','Green','Hall','Thomas','Clarke','Jackson','Wood','Thompson','Moore','Hill','Cooper','Ward','Morris','King','Watson','Harris','Baker','Turner','Phillips','Campbell','Parker','Evans','Scott','Roberts','Adams','Lewis','Mitchell','Carter','Robinson','Cook','Bailey','Murphy','Price','Morgan','Bell','Griffiths','Shaw']
    },
    PT: {
      first: ['João','Diogo','Tomás','Afonso','Rodrigo','Gonçalo','Tiago','Miguel','Francisco','Pedro','André','Bruno','Carlos','Duarte','Eduardo','Filipe','Gustavo','Henrique','Inácio','Jorge','Leandro','Manuel','Nuno','Óscar','Paulo','Rafael','Sérgio','Vasco','Xavier','Yuri','Zé','António','Bernardo','Cristiano','Daniel','Emanuel','Fábio','Gil','Hugo','Ivan','José','Kevin','Lourenço','Márcio','Nelson','Orlando','Rui','Simão','Valter','Wilson'],
      last: ['Silva','Santos','Ferreira','Pereira','Costa','Oliveira','Rodrigues','Martins','Jesus','Sousa','Fernandes','Gonçalves','Gomes','Lopes','Marques','Alves','Ribeiro','Pinto','Carvalho','Teixeira','Moreira','Correia','Mendes','Nunes','Soares','Vieira','Monteiro','Cardoso','Rocha','Coelho','Dias','Neves','Antunes','Mota','Baptista','Freitas','Araújo','Barbosa','Campos','Cunha','Faria','Leite','Machado','Peixoto','Quaresma','Reis','Sampaio','Tavares','Valente','Ximenes']
    },
    NL: {
      first: ['Daan','Sem','Milan','Luuk','Levi','Bram','Noah','Finn','Lars','Jesse','Thijs','Ruben','Niels','Joris','Koen','Sven','Timo','Wout','Xander','Yorick','Zane','Aiden','Boaz','Cas','Dylan','Elian','Floris','Gijs','Hidde','Ivo','Jens','Kyan','Liam','Mats','Niek','Otis','Pim','Quinn','Rik','Stijn','Tijn','Udo','Vince','Wesley','Xavi','Yasin','Zeger','Aron','Boris','Cees'],
      last: ['de Jong','Jansen','de Vries','van den Berg','Bakker','Visser','Smit','Meijer','de Boer','Mulder','de Groot','Bos','Vos','Peters','Hendriks','van Dijk','Kok','Jacobs','Vermeulen','Schoenmaker','Willems','Dijkstra','de Graaf','Kuiper','Prins','Schouten','van Leeuwen','Hermans','van der Meer','Postma','Hoekstra','Kramer','Evers','Groen','Koster','de Bruin','de Wit','Smits','Sanders','van Loon','van Rijn','Molenaar','de Ruiter','van Dam','Boerma','Boon','Hagen','Mol','Otter','Timmermans']
    },
    BR: {
      first: ['João','Gabriel','Pedro','Lucas','Guilherme','Rafael','Matheus','Felipe','Bruno','Carlos','Diego','Eduardo','Fernando','Gustavo','Henrique','Igor','José','Kauã','Leonardo','Marcos','Nathan','Otávio','Paulo','Renan','Samuel','Thiago','Vinícius','Wesley','Yago','Zeca','André','Bernardo','Caio','Danilo','Enzo','Fábio','Geovane','Heitor','Italo','Jhonatan','Kevin','Luiz','Murilo','Nicolas','Pietro','Raul','Sandro','Tales','Valmir','William'],
      last: ['Silva','Santos','Oliveira','Souza','Pereira','Lima','Carvalho','Almeida','Ferreira','Rodrigues','Gomes','Martins','Araújo','Melo','Barbosa','Rocha','Dias','Teixeira','Fernandes','Ribeiro','Costa','Nunes','Moreira','Pinto','Freitas','Cardoso','Moura','Machado','Ramos','Correia','Monteiro','Batista','Vieira','Neves','Campos','Cavalcanti','Peixoto','Rezende','Farias','Borges','Andrade','Assis','Queiroz','Coelho','Tavares','Macedo','Prado','Leite','Xavier','Fonseca']
    },
    AR: {
      first: ['Benjamín','Mateo','Thiago','Joaquín','Martín','Santino','Lautaro','Franco','Agustín','Tomás','Juan','Facundo','Ignacio','Nicolás','Santiago','Valentín','Ramiro','Emiliano','Maximiliano','Gonzalo','Leandro','Diego','Pablo','Rodrigo','Sebastián','Federico','Matías','Luciano','Bruno','Iván','Kevin','Axel','Bautista','Ciro','Damián','Esteban','Fabián','Gerónimo','Hernán','Ismael','Jerónimo','Lisandro','Mauricio','Nahuel','Octavio','Patricio','Renzo','Ulises','Vicente','Yamil'],
      last: ['González','Rodríguez','Gómez','Fernández','López','Martínez','Pérez','Sánchez','Romero','Torres','Álvarez','Ruiz','Ramírez','Flores','Acosta','Benítez','Medina','Herrera','Aguirre','Castro','Molina','Suárez','Ortiz','Silva','Nuñez','Rojas','Vega','Cabrera','Morales','Ibarra','Ponce','Villalba','Navarro','Peralta','Quiroga','Sosa','Domínguez','Correa','Luna','Méndez','Cardozo','Franco','Leiva','Montiel','Ojeda','Paz','Riquelme','Salinas','Tapia','Zárate']
    }
  };

  const FALLBACK = {
    first: ['Alex','Max','Nico','Leo','Sam','Chris','Pat','Robin','Taylor','Jordan'],
    last: ['Smith','Brown','Miller','Davis','Wilson','Moore','Clark','Hall','Allen','Young']
  };

  window.generateUniqueName = (countryCode) => {
    const pool = NAME_POOLS[countryCode] || FALLBACK;
    const first = pool.first[Math.floor(Math.random() * pool.first.length)];
    const last = pool.last[Math.floor(Math.random() * pool.last.length)];
    return `${first} ${last}`;
  };
})();
