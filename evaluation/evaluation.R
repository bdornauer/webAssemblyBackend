library("rjson") # json format
library("tidyverse") # ggplot2 include for graphs
library("hrbrthemes")
library("viridis")


# access data
dataArea <- fromJSON(file = "./OneDrive - uibk.ac.at/FH/Semester 2/VO_UE_Entwicklung und Betreib mobiler InfoS/webAssemblyBackend/evaluation/dataArea.json")
dataCells <- fromJSON(file = "./OneDrive - uibk.ac.at/FH/Semester 2/VO_UE_Entwicklung und Betreib mobiler InfoS/webAssemblyBackend/evaluation/dataCells.json")
dataSort <- fromJSON(file = "./OneDrive - uibk.ac.at/FH/Semester 2/VO_UE_Entwicklung und Betreib mobiler InfoS/webAssemblyBackend/evaluation/dataSort.json")

#calc median for each test row
functionCalJSandWams <- function(dataType, nameJS, nameWAMS, variant) {
  mediansJS <- c()
  mediansWAMS <- c()
  colors <- c()

  for (i in 1:length(dataType[[nameJS]])) {
    if (variant == 1) {
      if (unlist(dataType[["isMobile"]][i]) == "mobile device") {
        colors <- append(colors, "Mobile")
      } else {
        colors <- append(colors, "Desktop")
      }
    } else if (variant == 2) {
      if (grepl("Android", unlist(dataType[["browserInfo"]][i]), fixed = TRUE)) {
        colors <- append(colors, "Android")
      } else if (grepl("iPhone", unlist(dataType[["browserInfo"]][i]), fixed = TRUE) || grepl("iPad", unlist(dataType[["browserInfo"]][i]), fixed = TRUE) || grepl("Macintosh", unlist(dataType[["browserInfo"]][i]), fixed = TRUE)) {
        colors <- append(colors, "Apple OS")
      } else if (grepl("Windows", unlist(dataType[["browserInfo"]][i]), fixed = TRUE)) {
        colors <- append(colors, "Windows")
      } else {
        colors <- append(colors, "other")
      }
    }
    currentMedianJS <- median(unlist(dataType[[nameJS]][i]))
    currentMedianWAMS <- median(unlist(dataType[[nameWAMS]][i]))
    mediansJS <- append(mediansJS, currentMedianJS)
    mediansWAMS <- append(mediansWAMS, currentMedianWAMS)
  }

  return(list(mediansJS, mediansWAMS, colors))
}

# save js and wams for the different tests and problem sizes 
varianteType <- 2
area1 <- functionCalJSandWams(dataArea, "areaJS10000", "areaWAMS10000", varianteType)
area2 <- functionCalJSandWams(dataArea, "areaJS100000", "areaWAMS100000", varianteType)
area3 <- functionCalJSandWams(dataArea, "areaJS1000000", "areaWAMS1000000", varianteType)

sort1 <- functionCalJSandWams(dataSort, "sortJS2500", "sortWAMS2500", varianteType)
sort2 <- functionCalJSandWams(dataSort, "sortJS5000", "sortWAMS5000", varianteType)
sort3 <- functionCalJSandWams(dataSort, "sortJS10000", "sortWAMS10000", varianteType)

cells1 <- functionCalJSandWams(dataCells, "cellsJS250", "cellsWAMS250", varianteType)
cells2 <- functionCalJSandWams(dataCells, "cellsJS500", "cellsWAMS500", varianteType)
cells3 <- functionCalJSandWams(dataCells, "cellsJS1000", "cellsWAMS1000", varianteType)

# plot diagramm for medians and problem sizes 
multipleBoxPlot <- function(legend, names, values, colorValues) {
  data <- data.frame(
    name = names,
    SpeedUp = values,
    Typ = unlist(colorValues)
  )

  # Plot
  data %>%
    ggplot(aes(x = name, y = SpeedUp)) +
    scale_y_continuous(breaks = seq(0, 3, 0.25)) +
    geom_boxplot() +
    scale_fill_viridis(discrete = TRUE, alpha = 0.6) +
    geom_jitter(aes(colour = Typ),
      size = 1.5, alpha = 0.9
    ) +
    theme_linedraw() +
    theme(
      legend.position = "bottom",
      plot.title = element_text(size = 11)
    ) +
    ggtitle(legend) +
    scale_fill_brewer(palette = "BuPu") +
    xlab("")
}

#calc speed up - difference between js and wams data 
calcSpeedUp <- function(jsData, wamsData) {
  return(unlist(jsData) / unlist(wamsData))
}

speedUpSort1 <- calcSpeedUp(sort1[1], sort1[2])
speedUpSort2 <- calcSpeedUp(sort2[1], sort2[2])
speedUpSort3 <- calcSpeedUp(sort3[1], sort3[2])

speedUpArea1 <- calcSpeedUp(area1[1], area1[2])
speedUpArea2 <- calcSpeedUp(area2[1], area2[2])
speedUpArea3 <- calcSpeedUp(area3[1], area3[2])

speedUpCells1 <- calcSpeedUp(cells1[1], cells1[2])
speedUpCells2 <- calcSpeedUp(cells2[1], cells2[2])
speedUpCells3 <- calcSpeedUp(cells3[1], cells3[2])

# plot diagramms
sortNames <- c(rep("A-2500 Elemente", length(speedUpSort1)), rep("B-5000 Elemente", length(speedUpSort2)), rep("C-10000 Elemente", length(speedUpSort3)))
sortValue <- c(speedUpSort1, speedUpSort2, speedUpSort3)
sortColors <- c(sort1[3], sort2[3], sort3[3])
multipleBoxPlot("Sortierung", sortNames, sortValue, sortColors)

areaNames <- c(rep("A-10000 Elemente", length(speedUpArea1)), rep("B-100000 Elemente", length(speedUpArea2)), rep("C-1000000 Elemente", length(speedUpArea3)))
areaValue <- c(speedUpArea1, speedUpArea2, speedUpArea3)
areaColors <- c(area1[3], area2[3], area3[3])
multipleBoxPlot("Flächenberechnung", areaNames, areaValue, areaColors)

cellsNames <- c(rep("A-250 Läufe", length(speedUpCells1)), rep("B-500 Läufe", length(speedUpCells2)), rep("C-1000 Läufe", length(speedUpCells3)))
cellsValue <- c(speedUpCells1, speedUpCells2, speedUpCells3)
cellsColors <- c(cells1[3], cells2[3], cells2[3])
multipleBoxPlot("Conways Spiel des Leben", cellsNames, cellsValue, cellsColors)


#function to calc medians over runtime 
mediansRuns <- function(runsJS, runsWAMS) {
  medianRuns <- c()
  for (i in 1:30) {
    runSpeedUp <- c()
    for (j in 1:length(runsJS)) {
      runJS <- runsJS[[j]][i]
      runWAMS <- runsWAMS[[j]][i]
      if (!is.nan(runJS / runWAMS) && !is.infinite(runJS / runWAMS)) {
        runSpeedUp <- c(runSpeedUp, runJS / runWAMS)
      }
    }
    medianRuns <- c(medianRuns, median(runSpeedUp))
  }
  return(medianRuns)
}

mediansSpeedUpRunsArea10000 <- mediansRuns(dataArea[["areaJS10000"]], dataArea[["areaWAMS10000"]])
mediansSpeedUpRunsArea100000 <- mediansRuns(dataArea[["areaJS100000"]], dataArea[["areaWAMS100000"]])
mediansSpeedUpRunsArea1000000 <- mediansRuns(dataArea[["areaJS1000000"]], dataArea[["areaWAMS1000000"]])

mediansSpeedUpRunsCells250 <- mediansRuns(dataCells[["cellsJS250"]], dataCells[["cellsWAMS250"]])
mediansSpeedUpRunsCells500 <- mediansRuns(dataCells[["cellsJS500"]], dataCells[["cellsWAMS500"]])
mediansSpeedUpRunsCells1000 <- mediansRuns(dataCells[["cellsJS1000"]], dataCells[["cellsWAMS1000"]])

mediansSpeedUpRunsSort2500 <- mediansRuns(dataSort[["sortJS2500"]], dataSort[["sortWAMS2500"]])
mediansSpeedUpRunsSort5000 <- mediansRuns(dataSort[["sortJS5000"]], dataSort[["sortWAMS5000"]])
mediansSpeedUpRunsSort10000 <- mediansRuns(dataSort[["sortJS10000"]], dataSort[["sortWAMS10000"]])


#function to plot medians of runtime 
showMedianProcess <- function(title, mediansSpeedUpRuns1, mediansSpeedUpRuns2, mediansSpeedUpRuns3, logScala) {
  data <- data.frame(
    Runs = c(1:30),
    mediansSpeedUpRuns1 = mediansSpeedUpRuns1,
    mediansSpeedUpRuns2 = mediansSpeedUpRuns2,
    mediansSpeedUpRuns3 = mediansSpeedUpRuns3
  )
  
  diagram <- ggplot(data, aes(Runs)) +
    ylab("SpeedUp") +
    geom_line(aes(y = mediansSpeedUpRuns1, color = "Set A - SpeedUp")) +
    geom_line(aes(y = mediansSpeedUpRuns2, color = "Set B - SpeedUp")) +
    geom_line(aes(y = mediansSpeedUpRuns3, color = "Set C - SpeedUp")) +
    theme_linedraw() +
    labs(color='problem size') +
    ggtitle(title)
  
  
  if(logScala){
    diagram + scale_y_continuous(trans = 'log10')
  }else{
    diagram
  }
  
}

showMedianProcess("Speedup over time - Area", mediansSpeedUpRunsArea10000, mediansSpeedUpRunsArea100000, mediansSpeedUpRunsArea1000000, TRUE)
showMedianProcess("Speedup over time - Cells", mediansSpeedUpRunsCells250,mediansSpeedUpRunsCells500,mediansSpeedUpRunsCells1000, FALSE)
showMedianProcess("Speedup over time - Sort", mediansSpeedUpRunsSort2500,mediansSpeedUpRunsSort5000,mediansSpeedUpRunsSort10000, FALSE)

#some interesting data 
cat("Tests total: ", (length(unlist(area1[1])) + length(unlist(sort1[1])) + length(unlist(area1[1])) )*6*30, "\n")
cat("Participants area:", length(unlist(area1[1])), "\n" )
cat("Participants sort:", length(unlist(sort1[1])), "\n" )
cat("Participants cells:", length(unlist(cells1[1])), "\n" )