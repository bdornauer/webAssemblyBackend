//https://mbebenita.github.io/WasmExplorer/

//calc area
float myFunc(float x){
  return x*x+3*x+4;
}

void areaCalc(float a, float b, int n) {
  float area = 0;
  float delta = (b-a)/((float) n);

  for(int i=0; i<n; i++){
    area += delta*myFunc(a+delta*i);
  }
}

//sorting
void sortIntArray(int vals[], int size) {
  int a = 0;

  for (int i = 0; i < size; ++i)
        {
            for (int j = i + 1; j < size; ++j)
            {
                if (vals[i] > vals[j])
                {
                    a =  vals[i];
                    vals[i] = vals[j];
                    vals[j] = a;
                }
            }
        }
}

//1-dimensional celluar automate
//https://rosettacode.org/wiki/One-dimensional_cellular_automata

void celluarAutomate(int cells[], int cellsTemp[], int size, int iterations) {
   for(int j = 0; j < iterations; j++)
    {
        for (int i = 1; i < size-1; i++)
        {
           int left = cellsTemp[i-1];
           int middle = cellsTemp[i];
           int right = cellsTemp[i+1];
           cells[i] = test(left,middle,right);
        }
        cellsTemp = cells;
    }
}

int test (int left, int center, int right) {
    if (left == 1 && center == 1 && right == 1) return 0;
    else if (left == 1 && center == 1 && right == 0) return 1;
    else if (left == 1 && center == 0 && right == 1) return 0;
    else if (left == 1 && center == 0 && right == 0) return 1;
    else if (left == 0 && center == 1 && right == 1) return 1;
    else if (left == 0 && center == 1 && right == 0) return 0;
    else if (left == 0 && center == 0 && right == 1) return 1;
    else if (left == 0 && center == 0 && right == 0) return 0;
   return 0;
  }