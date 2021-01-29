<?php

namespace App\Collections;

use Illuminate\Database\Eloquent\Collection;

class PostCollection extends Collection
{
    public function findMostVotes()
    {
        return $this->make($this->items)
                    ->sortByDesc('number_of_votes')
                    ->first();
    }
}
