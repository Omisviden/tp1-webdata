//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function recupererPremierEnfantDeTypeElement(n) {
  var x = n.firstChild;
  while (x.nodeType != 1) {
    // Test if x is an element node (and not a text node or other)
    x = x.nextSibling;
  }
  return x;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//change le contenu de l'élement avec l'id "nom" avec la chaine de caractéres en paramčtre
function setNom(nom) {
  var elementHtmlARemplir =
    window.document.getElementById("id_nom_a_remplacer");
  elementHtmlARemplir.innerHTML = nom;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//charge le fichier XML se trouvant à l'URL relative donné dans le paramčtreet le retourne
function chargerHttpXML(xmlDocumentUrl) {
  var httpAjax;

  httpAjax = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject("Microsoft.XMLHTTP");

  if (httpAjax.overrideMimeType) {
    httpAjax.overrideMimeType("text/xml");
  }

  //chargement du fichier XML à l'aide de XMLHttpRequest synchrone (le 3° paramčtre est défini à false)
  httpAjax.open("GET", xmlDocumentUrl, false);
  httpAjax.send();

  return httpAjax.responseXML;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Charge le fichier JSON se trouvant à l'URL donnée en paramčtre et le retourne
function chargerHttpJSON(jsonDocumentUrl) {
  var httpAjax;

  httpAjax = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject("Microsoft.XMLHTTP");

  if (httpAjax.overrideMimeType) {
    httpAjax.overrideMimeType("text/xml");
  }

  // chargement du fichier JSON à l'aide de XMLHttpRequest synchrone (le 3° paramčtre est défini à false)
  httpAjax.open("GET", jsonDocumentUrl, false);
  httpAjax.send();

  var responseData = eval("(" + httpAjax.responseText + ")");

  return responseData;
}

function changeBackground(color) {
  let button = document.getElementById("myButton1");
  button.style.color = "white";
  document.body.style.backgroundColor = color; // C'est pas du bleu mais ça fait moins mal aux yeux
}

function getProcessedXML(xml, xsl, param) {
  // Chargement du fichier XSL à l'aide de XMLHttpRequest synchrone
  var xslDocument = chargerHttpXML(xsl);

  //création d'un processuer XSL
  var xsltProcessor = new XSLTProcessor();

  // Importation du .xsl
  xsltProcessor.importStylesheet(xslDocument);

  if (param) {
    //passage du paramčtre à la feuille de style
    xsltProcessor.setParameter("", "code", param);
  }

  var xmlDocument = chargerHttpXML(xml);

  // Création du document XML transformé par le XSL
  return xsltProcessor.transformToDocument(xmlDocument);
}

function resetAllCountryColors(id) {
  let worldmap = document.getElementById(id);
  countries = worldmap.children[0].children[1].children; // wow
  for (country of countries) {
    country.style.fill = "#CCCCCC";
  }
}

// Question 3
function setDetails(code) {
  let xml = "../countriesTP.xml";
  let xsl = "../cherchePays.xsl";

  let xmlDoc = getProcessedXML(xml, xsl, code);

  let parent = window.document.getElementById("id_element_a_remplacer");

  // insérer l'élement transformé dans la page html
  parent.innerHTML = xmlDoc.getElementsByTagName(
    "element_a_recuperer"
  )[0].innerHTML;

  // Question 11

  ///   Get list of all countries that share a language with the original country
  xsl = "../getAllCountryLanguages.xsl";
  let xmlDoc2 = getProcessedXML(xml, xsl, code);
  let languages = xmlDoc2.firstChild.innerHTML.split("\n");
  // Remove first and last elements, both empty for some reason
  languages.shift();
  languages.pop();

  // Remove starting spaces that are there for some reason
  languages = languages.map(function (lang) {
    return lang.trim();
  });
  // console.log(languages);

  // Get all countries and their associated languages
  xsl = "../getAllCountriesLangsAsRaw.xsl";
  let xmlDoc3 = getProcessedXML(xml, xsl, null);

  let countrycodes = xmlDoc3.getElementsByTagName("country");
  let languageLists = xmlDoc3.getElementsByTagName("languages");

  // iterate over the language lists of all countries and match them to
  // the languages array created above
  let results = [];
  for (let i = 0; i < countrycodes.length; i++) {
    let langList = languageLists[i];
    let country = countrycodes[i];

    if (
      languages.some((elem) => langList.innerHTML.includes(elem)) &&
      results.indexOf(country) === -1
    ) {
      results.push(country.innerHTML);
    }
  }

  // reset all colors so that different queries don't overlap
  resetAllCountryColors("svgdivworld");
  // finally, paint each country whose code is in the list in green
  let worldmap = document.getElementById("svgdivworld");
  countries = worldmap.children[0].children[1].children; // wow
  for (let i = 0; i < countries.length; i++) {
    if (results.includes(countries[i].id)) {
      countries[i].style.fill = "#1aff1a";
    }
  }
}

// Question 4
function loadSVG(path, divid) {
  let svgAsXML = chargerHttpXML(path);
  let svgAsString = new XMLSerializer().serializeToString(svgAsXML);
  // Recherche du parent (dont l'id est "here") de l'élément à remplacer dans le document HTML courant
  var elementHtmlParent = window.document.getElementById(divid);
  elementHtmlParent.innerHTML = svgAsString;
}

// Question 5
function makeClickable(id, func) {
  let svg = document.getElementById(id);
  svg.addEventListener("mousedown", func);
}

function exempleClicked(e) {
  let svgp = document.getElementById("svgpexemple");
  if (e.target.attributes.title != undefined)
    svgp.innerHTML = e.target.attributes.title.value;
}

// Question 7
function worldClicked(e) {
  let svgp = document.getElementById("svgpworld");
  if (e.target.attributes.countryname != undefined)
    svgp.innerHTML = e.target.attributes.countryname.value;
}

// Question 8
function makeHoverable(id) {
  let svg = document.getElementById(id);
  let countries = svg.getElementsByTagName("g")[0].children;
  for (const c of countries) {
    c.addEventListener("mouseover", highlightCountry);
    c.addEventListener("mouseleave", resetCountry);
  }
}

function getCountryDetails(code) {
  let xmlDocumentUrl = "../countriesTP.xml";
  let xslDocumentUrl = "../cherchePaysPlus.xsl";

  //Question 10: complétez les infromations affichées au bouton 8 avec le nom de la monnaie du pays
  let urlJson = "https://restcountries.com/v2/alpha/" + code;
  let jsonData = chargerHttpJSON(urlJson);
  let currency = jsonData.currencies[0].name;
  p = document.createElement("p");
  p.innerHTML = "The currency of this country is " + currency;

  var newXmlDocument = getProcessedXML(xmlDocumentUrl, xslDocumentUrl, code);

  // Parcours de la liste des noms avec une boucle for et
  // construction d'une chaine de charactčres contenant les noms séparés par des espaces
  // Pour avoir la longueur d'une liste : attribut 'length'
  // Accčs au texte d'un noeud "LastName" : NOM_NOEUD.firstChild.nodeValue

  // Recherche du parent (dont l'id est "here") de l'élément à remplacer dans le document HTML courant
  var elementHtmlParent = window.document.getElementById("countryinfo");

  // insérer l'élement transformé dans la page html
  elementHtmlParent.removeChild(elementHtmlParent.lastChild);
  let lastElem = elementHtmlParent.lastChild;
  if (lastElem != undefined) elementHtmlParent.removeChild(lastElem);
  elementHtmlParent.appendChild(
    newXmlDocument.getElementsByTagName("countryinfo")[0]
  );
  elementHtmlParent.appendChild(p);
}

//Question 8 suite: changez la couleur de pays quand la souris est en dessus
function highlightCountry(e) {
  if (e.target.attributes.id != undefined) {
    // Change color of country to green
    e.target.style.fill = "#66ccff";
    // Insert data into cells
    getCountryDetails(e.target.attributes.id.value);
  }
}

function resetCountry(e) {
  e.target.style.fill = "#CCCCCC";
}

//Question 9: complétez le champ de saisie du bouton 3 avec une fonction d'autocomplétion
function populateDatalist() {
  let datalist = document.getElementById("codelist");
  let xsl = "../getAllCodes.xsl";
  let xml = "../countriesTP.xml";

  let newXml = getProcessedXML(xml, xsl, null);

  let codes = newXml.firstChild.innerHTML.split(" ");
  console.log(codes);
  codes.forEach((code) => {
    let option = document.createElement("option");
    option.value = code;
    datalist.appendChild(option);
  });
}

//Question 11: Coloriez en vert  sur  le plan les pays où les  langues du pays sélectionné
// dans le  champ de saisie du bouton  3 sont également parlées

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Bouton2_ajaxEmployees(xmlDocumentUrl) {
  var xmlDocument = chargerHttpXML(xmlDocumentUrl);

  //extraction des noms à partir du document XML (avec une feuille de style ou en javascript)
  var lesNoms = xmlDocument.getElementsByTagName("LastName");

  // Parcours de la liste des noms avec une boucle for et
  // construction d'une chaine de charactčres contenant les noms séparés par des espaces
  // Pour avoir la longueur d'une liste : attribut 'length'
  // Accčs au texte d'un noeud "LastName" : NOM_NOEUD.firstChild.nodeValue
  var chaineDesNoms = "";
  for (i = 0; i < lesNoms.length; i++) {
    if (i > 0) {
      chaineDesNoms = chaineDesNoms + ", ";
    }
    chaineDesNoms = chaineDesNoms + lesNoms[i].firstChild.nodeValue + " ";
  }

  // Appel (ou recopie) de la fonction setNom(...) ou bien autre façon de modifier le texte de l'élément "span"
  setNom(chaineDesNoms);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Bouton3_ajaxBibliographie(
  xmlDocumentUrl,
  xslDocumentUrl,
  baliseElementARecuperer
) {
  // Chargement du fichier XSL à l'aide de XMLHttpRequest synchrone
  var xslDocument = chargerHttpXML(xslDocumentUrl);

  //création d'un processuer XSL
  var xsltProcessor = new XSLTProcessor();

  // Importation du .xsl
  xsltProcessor.importStylesheet(xslDocument);

  // Chargement du fichier XML à l'aide de XMLHttpRequest synchrone
  var xmlDocument = chargerHttpXML(xmlDocumentUrl);

  // Création du document XML transformé par le XSL
  var newXmlDocument = xsltProcessor.transformToDocument(xmlDocument);

  // Recherche du parent (dont l'id est "here") de l'élément à remplacer dans le document HTML courant
  var elementHtmlParent = window.document.getElementById(
    "id_element_a_remplacer"
  );

  // insérer l'élement transformé dans la page html
  elementHtmlParent.innerHTML = newXmlDocument.getElementsByTagName(
    "element_a_recuperer"
  )[0].innerHTML;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Bouton4_ajaxBibliographieAvecParametres(
  xmlDocumentUrl,
  xslDocumentUrl,
  baliseElementARecuperer,
  paramXSL_type_reference
) {
  // Chargement du fichier XSL à l'aide de XMLHttpRequest synchrone
  var xslDocument = chargerHttpXML(xslDocumentUrl);

  //création d'un processuer XSL
  var xsltProcessor = new XSLTProcessor();

  // Importation du .xsl
  xsltProcessor.importStylesheet(xslDocument);

  //passage du paramčtre à la feuille de style
  xsltProcessor.setParameter("", "param_ref_type", paramXSL_type_reference);

  // Chargement du fichier XML à l'aide de XMLHttpRequest synchrone
  var xmlDocument = chargerHttpXML(xmlDocumentUrl);

  // Création du document XML transformé par le XSL
  var newXmlDocument = xsltProcessor.transformToDocument(xmlDocument);

  // Recherche du parent (dont l'id est "here") de l'élément à remplacer dans le document HTML courant
  var elementHtmlParent = window.document.getElementById(
    "id_element_a_remplacer"
  );

  // insérer l'élement transformé dans la page html
  elementHtmlParent.innerHTML = newXmlDocument.getElementsByTagName(
    baliseElementARecuperer
  )[0].innerHTML;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Bouton4_ajaxEmployeesTableau(xmlDocumentUrl, xslDocumentUrl) {
  //commenter la ligne suivante qui affiche la boîte de dialogue!
  alert("Fonction à compléter...");
}
