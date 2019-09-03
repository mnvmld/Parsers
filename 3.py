import json
import urllib.request
import pandas as pd



#----------------------------Loading data from server--------------------------------------
def load_data():
    url = 'https://....Site.json'
    print('Start loading information from %s' % url)
    response = urllib.request.urlopen(url)
    data = response.read()
    text = data.decode('utf-8')
    data = json.loads(text)
    print("Successfully loaded %d a" % len(data['acList']))
    return data
#-------------------------------------------------------------------------------------------


#------------------------Create dict names of columns fron data-----------------------------
def create_dict_keys(data):
    dict_keys = []
    for ac in data['acList']:
        for key in ac.keys():
            if not (key in dict_keys):
                dict_keys.append(key)
    print('Was found %d keys:' % len(dict_keys))
    print(dict_keys)
    return(dict_keys)
#-------------------------------------------------------------------------------------------


#--------------------------Seve data from server to excel-----------------------------------
def save_data_to_excel(data, excel_name, M_excel_name):
    print('Creating dict of column names')
    dict_keys = create_dict_keys(data)
    print('Successfully created dict of column names')
    print('Transforming data to pandas')
    All_dict = []
    for ac in data['acList']:
        cur_d = dict.fromkeys(dict_keys, 0)
        for key in ac.keys():
            cur_d[key]=ac[key]
        All_dict.append(cur_d)
    dt = pd.DataFrame(All_dict)
    dt_M = dt.loc[dt['M'] == True]
    print('Successfully transformed data to pandas')
    print('Saving data to excel')
    dt.to_excel(excel_name)
    dt_M.to_excel(M_excel_name)
    print('Successfully saved data to excel')
#-------------------------------------------------------------------------------------------


#------------------------------------------Main---------------------------------------------
def main():
    data = load_data()
    save_data_to_excel(data, 'S_result.xlsx', 'M.xlsx')




#-------------------------------------------------------------------------------------------



if __name__ == '__main__':
    main()
