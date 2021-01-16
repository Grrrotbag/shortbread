# Shortbread

Shortbread is a url shortening microservice. You can enter a url and submit, and a json object containing the original url and a shortened url will be returned.

If the shortened url is included at the end of `/api/shorturl/`, shortbread will look up the shortened url in a database and forward you to the original url associated with the shortened url.

The urls are not actually that short as this was produced to complete the FreeCodeCamp microservice challenge, and the tests require the aforementioned url structure. But, in theory, this could be shortened significantly quite easily.