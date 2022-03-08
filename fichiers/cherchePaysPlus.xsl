<?xml version="1.0"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:param name="code" />
    <xsl:output method="html" />
    <xsl:template match="/">
                <countryinfo>
                    <tr>
                        <td>
                            <xsl:apply-templates select="//country[country_codes/cca2=$code]/c_name/of_name" />
                        </td>
                        <td>
                            <xsl:apply-templates select="//country[country_codes/cca2=$code]/capital" />
                        </td>
                        <td>
                            <xsl:apply-templates select="//country[country_codes/cca2=$code]/languages" />
                        </td>
                        <td>
                            <img>
                                <xsl:attribute name="src">
                                    <xsl:text>http://www.geonames.org/flags/x/</xsl:text>
                                    <xsl:value-of select="translate($code, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')" />
                                    <xsl:text>.gif</xsl:text>
                                </xsl:attribute>
                                <xsl:attribute name="alt"></xsl:attribute>
                                <xsl:attribute name="height">40</xsl:attribute>
                                <xsl:attribute name="width">60</xsl:attribute>
                            </img>
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