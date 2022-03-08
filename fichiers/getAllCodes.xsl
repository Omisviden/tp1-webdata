<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
        <xsl:param name="code" />

<xsl:template match="/">
 <xsl:for-each select="//country/country_codes/cca2">
        <xsl:value-of select="concat( ., ' ')"/>
  </xsl:for-each>
</xsl:template>
</xsl:stylesheet>