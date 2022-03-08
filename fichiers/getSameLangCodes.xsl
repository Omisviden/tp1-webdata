<?xml version="1.0"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:param name="code" />
    <xsl:output method="html" />
    <xsl:template match="/">
                <countryinfo>
                    <tr>
                        <td>
                            <xsl:apply-templates select="//country/country_codes/cca2" />
                        </td>
                        <td> 
                            <xsl:apply-templates select="//country/languages" />
                        </td>
                    </tr>
                </countryinfo>
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