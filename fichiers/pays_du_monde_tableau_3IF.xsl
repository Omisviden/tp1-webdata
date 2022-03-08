<?xml version="1.0" encoding="UTF-8"?>

<!-- New document created with EditiX at Tue Mar 01 14:58:10 CET 2022 -->

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output method="html"/>
	
	<xsl:template match="/">
	<html>
	 	<head>
	 	<title>
	 	Pays du monde
	 	</title>
	 	</head>
		<body style="background-color:white;">
		<h1> Les pays du monde </h1>
		Mise en forme par : Thanh Lam DANG, Thibaut FAYARD (B3325)

		</body>
			<xsl:apply-templates select = "//metadonnees"> 
          	</xsl:apply-templates>
          	<!-- Affichage des statistiques sur les pays avant les tables -->
          	<p> Pays avec plus de 4 noms natifs: 
          		<br/>
          		<xsl:for-each select="//country/c_name/comm_name">
	          		<xsl:if test = "count(//country/c_name[comm_name=current()]/native_name) &gt; 4">
	          			<xsl:variable name = "nomPays" select="current()"> </xsl:variable>
	          				<li> 
	          				<xsl:value-of select = "current()"/> : 
	          				<xsl:for-each select="//country/c_name[comm_name=$nomPays]/native_name">
								<xsl:value-of select="comm_name"/> (<xsl:value-of select = "@lang"/>)
								<xsl:if test="position() != last() ">
									<xsl:text>, </xsl:text>
								</xsl:if>

							</xsl:for-each>
							</li>
						<br/>
					</xsl:if>
				</xsl:for-each>
				
			</p>
			<p> Le pays ayant le plus de voisins est : 		
         		<xsl:for-each select="//country/borders">
         			<xsl:sort select="count(neighbour)" data-type = "number" order="descending"/>
         				<xsl:variable name="nbVoisins" select="count(neighbour)"/>
         				<xsl:if test="position()=1">
         					<xsl:value-of select="//country[borders=current()]/c_name/comm_name"/>, nb de voisins : <xsl:value-of select="$nbVoisins"/>
         				</xsl:if>
         		</xsl:for-each>		

         		
    		</p><hr/>
          	
          	<xsl:for-each select="//country/infosContinent[not (continent = preceding:: continent)]/continent">
          		<xsl:variable name="tmpConti" select="current()"/>
          		<br/>
          		<xsl:if test = "$tmpConti!=''">
					<h2>Pays du continent : <xsl:value-of select="$tmpConti"/> par sous-régions : </h2>
					<xsl:for-each select="//country/infosContinent[(continent = $tmpConti) and not (subregion = preceding:: subregion)]/subregion">
						<xsl:variable name="tmpSubReg" select="current()"/>
						<xsl:apply-templates select="current()"/>
					</xsl:for-each>
				</xsl:if>
				<xsl:if test = "$tmpConti=''">
					<h2>Pays du continent : Indéfini (<xsl:value-of select ="count(//country[infosContinent/continent='']/c_name/of_name)"/> pays)</h2>
					<xsl:apply-templates select="current()"/>
					
				</xsl:if>

				
				
 			</xsl:for-each>
	</html>
	</xsl:template>
	
	<xsl:template match="metadonnees">
 		<p style="text-align:center; color:green;"> Objectif : <xsl:value-of select="objectif"/>
 		</p><hr/>
	</xsl:template>



	<xsl:template match="//continent"> <!-- Le cas ou continent est vide-->
		<table border="3" width="600" align="center">
			<tr>
				<th>Num</th>
				<th>Nom</th>
				<th>Capitale</th>
				<th>Voisins</th>
				<th>Coordonnees</th>
				<th>Drapeau</th>
			</tr>
			<xsl:apply-templates select="//country[infosContinent/continent=current()]"/>
			
		</table>
	</xsl:template>


	<xsl:template match="//subregion"> <!-- Le cas ou continent et sous-continent existent-->
		<h3>
			<xsl:value-of select="current()"/> (<xsl:value-of select ="count(//country[infosContinent/subregion=current()]/c_name/of_name)"/> pays)
		</h3>
		<table border="3" width="600" align="center">
			<tr>
				<th>Num</th>
				<th>Nom</th>
				<th>Capitale</th>
				<th>Voisins</th>
				<th>Coordonnees</th>
				<th>Drapeau</th>
			</tr>
			<xsl:apply-templates select="//country[infosContinent/subregion=current()]"/>
			
		</table>
	</xsl:template>




	<xsl:template match="country">

		<tr>
			<td>
				<xsl:value-of select="position()"/>
			</td>
			<td>
				<span style="color:green">
						<xsl:value-of select="c_name/comm_name"/>
				</span>
				<xsl:text> (</xsl:text>
				<xsl:value-of select="c_name/of_name"/>
				<xsl:text>)</xsl:text>
				<br/>
				<xsl:if test="c_name/native_name/@lang='fra'">
				<span style="color:blue">
						<xsl:text> Nom français : </xsl:text>
						<xsl:value-of select="c_name/native_name[@lang='fra']/of_name"/>
						<br/>
				</span>
				</xsl:if>
			</td>
			<td> 
				<xsl:value-of select="capital"/>
			</td>
			<td>
			<xsl:if test="count(borders) &gt; 0">
				<xsl:for-each select="borders">
					<xsl:for-each select="neighbour">
						<xsl:variable name = "code" select="current()"> </xsl:variable>
						<xsl:value-of select="//country[country_codes/cca3=$code]/c_name/comm_name"/>
						<xsl:if test="position() != last() ">
							<xsl:text>, </xsl:text>
						</xsl:if>
					</xsl:for-each>	
				</xsl:for-each>	
			</xsl:if>
			<xsl:if test = "(count(borders) = 0) and (landlocked='false')"> Île </xsl:if>
			</td>

			<td>
				<xsl:text>Latitude :</xsl:text>
				<xsl:value-of select="coordinates/@lat"/>
				<br/>
				<xsl:text>Longitude :</xsl:text>
				<xsl:value-of select="coordinates/@long"/>

			</td>
			<td>
				<img>
	    			<xsl:attribute name="src">
	        			<xsl:text>http://www.geonames.org/flags/x/</xsl:text>
						<xsl:value-of select="translate(country_codes/cca2, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')"/>
						<xsl:text>.gif</xsl:text>                  
	    			</xsl:attribute>
	    			<xsl:attribute name="alt"> </xsl:attribute>
	    			<xsl:attribute name="height">40</xsl:attribute>
	    			<xsl:attribute name="width">60</xsl:attribute>
				</img>

			</td>
	 	</tr>
	</xsl:template>

</xsl:stylesheet>


