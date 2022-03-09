<?xml version="1.0"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:param name="code" />
    <xsl:output method="html" />
    <xsl:template match="/">
        <element_a_recuperer>
            <xsl:for-each select="//country[country_codes/cca2=$code]/languages">
                <xsl:value-of select="." />
            </xsl:for-each>
        </element_a_recuperer>
    </xsl:template>
</xsl:stylesheet>