function r(e){return e?e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[¿¡?,()'"\.!]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""):""}export{r as s};
