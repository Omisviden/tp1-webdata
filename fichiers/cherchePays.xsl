<?xml version="1.0"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:param name="code" />
    <xsl:output method="html" />
    <xsl:template match="/">
        <HTML>
            <BODY bgcolor="#FFFFCC">
                <H1>Bibliographie</H1>
                <element_a_recuperer>
                    <ul>
                        <xsl:apply-templates select="//Country[contains(cca2,$code)]/capital" />
                    </ul>
                </element_a_recuperer>
            </BODY>
        </HTML>
    </xsl:template>
    <xsl:template match="Countries">
        <LI>
            <xsl:value-of select=".//comm_name" />
            :
            <xsl:value-of select=".//capital" />
            .
        </LI>
    </xsl:template>

</xsl:stylesheet>