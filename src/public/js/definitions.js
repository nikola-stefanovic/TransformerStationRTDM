var diagramDescription = [
  {name:"Struja", value:"IPTL,IPTA,IPTH", labels:['Tmin','Tsr','Tmax'], unitMeasure:"Struja (mA)"},
  {name:"Aktivna snaga", value:"PPTL,PPTA,PPTH", labels:['Pmin','Psr','Pmax'], unitMeasure:"Snaga (W)"},
  {name:"Reaktivna snaga", value:"PQTL,PQTA,PQTH", labels:['Qmin','Qsr','Qmax'], unitMeasure:"Reaktivna snaga (VAR)"},
  {name:"Prividna snaga", value:"PSTL,PSTA,PSTH", labels:['Smin','Ssr','Smax'], unitMeasure:"Prividna snaga (VA)"},
  {name:"Faktor snage", value:"PFTL,PFTA,PFTH", labels:['PFmin','PFsr','PFmax'], unitMeasure:"Faktor snage"},

  {name:"Frekvencija", value:"FREL,FREA,FREH", labels:['Fmin','Fsr','Fmax'], unitMeasure:"Frekvencija (Hz)"},
  {name:"Temperatura", value:"TEML,TEMA,TEMH", labels:['TEMPmin','TEMPsr','TEMPmax'], unitMeasure:"Temperatura (C)"},
  {name:"Struja nule", value:"IPNL,IPNA,IPAH", labels:['Nmin','Nsr','Nmax'], unitMeasure:"Struja (mA)"},

  {name:"Struje faza", value:"IPAA,IPBA,IPCA,IPAH,IPBH,IPCH,IPAL,IPBL,IPCL", labels:['A','B','C','Amax','Bmax','Cmax','Amin','Bmin','Cmin'], unitMeasure:"Struja (kV)"},
  // {name:"Struje faza AVG", value:"IPAA,IPBA,IPCA", labels:['A','B','C'], unitMeasure:"Struja (mA)"},
  // {name:"Struje faza MIN", value:"IPAL,IPBL,IPCL", labels:['Amin','Bmin','Cmin'], unitMeasure:"Current (mA)"},
  // {name:"Struje faza MAX", value:"IPAH,IPBH,IPCH", labels:['Amax','Bmax','Cmax'], unitMeasure:"Current (mA)"},
  {name:"Fazni naponi", value:"VABH,VBCH,VCAH,VABA,VBCA,VCAA,VABL,VBCL,VCAL", labels:['ABmax','BCmax','CAmax','AB','BC','CA','ABmin','BCmin','CAmin'], unitMeasure:"Napon (kV)"},
  // {name:"Fazni naponi AVG", value:"VABA,VBCA,VCAA", labels:['AB','BC','CA'], unitMeasure:"Napon (kV)"},
  // {name:"Fazni naponi MIN", value:"VABL,VBCL,VCAL", labels:['ABmin','BCmin','CAmin'], unitMeasure:"Voltage (kV)"},
  // {name:"Fazni naponi MAX", value:"VABH,VBCH,VCAH", labels:['ABmax','BCmax','CAmax'], unitMeasure:"Voltage (kV)"},
  
  {name:"Aktivna snaga faza", value:"PPAA,PPBA,PPCA,PPAH,PPBH,PPCH,PPAL,PPBL,PPCL", labels:['A','B','C','Amax','Bmax','Cmax','Amin','Bmin','Cmin'], unitMeasure:"Aktivna snaga (kW)"},
  {name:"Reaktivna snaga faza", value:"PQAA,PQBA,PQCA,PQAH,PQBH,PQCH,PQAL,PQBL,PQCL", labels:['A','B','C','Amax','Bmax','Cmax','Amin','Bmin','Cmin'], unitMeasure:"Reaktivna snaga (kW)"}
];


/*
var transformerDescription = [
  {name:"Transformer a", id:41},
  {name:"Transformer b", id:90}];
*/