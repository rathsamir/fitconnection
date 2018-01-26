<?php
$string='8567816412512_10_20';
echo substr_count($string, '_'); 
$words = explode('_', $string);
$last_word = array_pop($words);
echo $last_word;
$first_chunk = implode('_', $words);
echo $first_chunk;